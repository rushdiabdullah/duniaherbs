import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToyyibCallback } from '@/lib/toyyibpay';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/** ToyyibPay menghantar POST (biasanya x-www-form-urlencoded). Baca body sekali sahaja. */
async function readToyyibCallbackParams(req: NextRequest): Promise<Record<string, string>> {
  const params: Record<string, string> = {};
  const ct = (req.headers.get('content-type') || '').toLowerCase();

  if (ct.includes('multipart/form-data')) {
    try {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        params[key] = String(value);
      });
    } catch {
      /* empty */
    }
    return params;
  }

  try {
    const raw = (await req.text()).trim();
    if (raw) {
      new URLSearchParams(raw).forEach((v, k) => {
        params[k] = v;
      });
    }
  } catch {
    /* empty */
  }
  return params;
}

export async function POST(req: NextRequest) {
  try {
    const params = await readToyyibCallbackParams(req);

    const refno = params.refno ?? '';
    const status = params.status ?? '';
    const orderNo = params.order_id ?? '';
    const billcode = params.billcode ?? '';
    const receivedHash = params.hash ?? '';

    console.log('ToyyibPay callback:', { refno, status, orderNo, billcode });

    if (!verifyToyyibCallback({ status, order_id: orderNo, refno, hash: receivedHash })) {
      console.error('Invalid ToyyibPay callback hash');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const paid = status === '1';
    const paymentStatus = paid ? 'paid' : status === '2' ? 'pending' : 'failed';

    const updatePayload = {
      payment_status: paymentStatus,
      payment_ref: refno || billcode,
      payment_time: paid ? new Date().toISOString() : null,
      callback_raw: params,
      updated_at: new Date().toISOString(),
    };

    const supabase = getSupabase();
    let updated = false;

    if (orderNo) {
      const { data, error } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('order_no', orderNo)
        .select('id');
      if (error) {
        console.error('Order update error:', error.message);
      } else if (data && data.length > 0) {
        updated = true;
      }
    }

    if (!updated && billcode) {
      const { data, error } = await supabase
        .from('orders')
        .update(updatePayload)
        .eq('bill_code', billcode)
        .select('id');
      if (error) {
        console.error('Order update (billcode) error:', error.message);
      } else if (data && data.length > 0) {
        updated = true;
      }
    }

    if (!updated) {
      console.warn('ToyyibPay callback: no matching order found', { orderNo, billcode });
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 });
  }
}
