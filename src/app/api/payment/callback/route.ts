import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyXSignature } from '@/lib/billplz';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => { params[key] = String(value); });

    const billId = params.id;
    const paid = params.paid === 'true';
    const state = params.state;
    const xSignature = params.x_signature;
    const orderNo = params.reference_1;

    console.log('Billplz callback:', { billId, paid, state, orderNo });

    if (xSignature && !verifyXSignature(params, xSignature)) {
      console.error('Invalid x_signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const paymentStatus = paid ? 'paid' : state === 'due' ? 'pending' : 'failed';

    const updateQuery = orderNo
      ? supabase.from('orders').update({
          payment_status: paymentStatus,
          payment_ref: billId,
          payment_time: paid ? new Date().toISOString() : null,
          callback_raw: params,
          updated_at: new Date().toISOString(),
        }).eq('order_no', orderNo)
      : supabase.from('orders').update({
          payment_status: paymentStatus,
          payment_ref: billId,
          payment_time: paid ? new Date().toISOString() : null,
          callback_raw: params,
          updated_at: new Date().toISOString(),
        }).eq('bill_code', billId);

    const { error } = await updateQuery;
    if (error) console.error('Order update error:', error.message);

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 });
  }
}
