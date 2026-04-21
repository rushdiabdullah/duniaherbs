import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  bestPaymentRefFromTransactions,
  getBillTransactions,
  transactionsIndicatePaid,
} from '@/lib/toyyibpay';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/**
 * After customer returns from ToyyibPay (return URL), confirm bill status via ToyyibPay API
 * and mark our order paid. Fills the gap when server-side callback URL is wrong, blocked, or delayed.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const billcode = typeof body.billcode === 'string' ? body.billcode.trim() : '';
    if (!billcode || !/^[a-zA-Z0-9_-]+$/.test(billcode)) {
      return NextResponse.json({ error: 'billcode tidak sah' }, { status: 400 });
    }

    const rows = await getBillTransactions(billcode);
    if (!transactionsIndicatePaid(rows)) {
      return NextResponse.json({ ok: true, updated: false, reason: 'not_paid' });
    }

    const paymentRef = bestPaymentRefFromTransactions(rows) || billcode;
    const supabase = getSupabase();

    const { data: orderRows, error: fetchErr } = await supabase
      .from('orders')
      .select('id, payment_status')
      .eq('bill_code', billcode)
      .limit(1);

    if (fetchErr) {
      console.error('sync order lookup:', fetchErr.message);
      return NextResponse.json({ error: 'Gagal semak pesanan' }, { status: 500 });
    }
    const existing = orderRows?.[0];
    if (!existing) {
      return NextResponse.json({ ok: true, updated: false, reason: 'no_order' });
    }
    if (existing.payment_status === 'paid') {
      return NextResponse.json({ ok: true, updated: false, reason: 'already_paid' });
    }

    const updatePayload = {
      payment_status: 'paid' as const,
      payment_ref: paymentRef,
      payment_time: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      callback_raw: { source: 'return_url_sync', billcode },
    };

    const { error: upErr } = await supabase.from('orders').update(updatePayload).eq('bill_code', billcode);
    if (upErr) {
      console.error('sync order update:', upErr.message);
      return NextResponse.json({ error: 'Gagal kemas kini pesanan' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, updated: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Payment sync error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
