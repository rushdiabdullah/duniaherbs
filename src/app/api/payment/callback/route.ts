import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyToyyibCallback } from '@/lib/toyyibpay';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const params: Record<string, string> = {};
    formData.forEach((value, key) => { params[key] = String(value); });

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

    if (orderNo) {
      const { data, error } = await supabase.from('orders').update(updatePayload).eq('order_no', orderNo).select('id');
      if (error) console.error('Order update error:', error.message);
      else if (data?.length) return NextResponse.json({ status: 'ok' });
    }
    if (billcode) {
      const { error } = await supabase.from('orders').update(updatePayload).eq('bill_code', billcode);
      if (error) console.error('Order update (billcode) error:', error.message);
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 });
  }
}
