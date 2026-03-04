import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createBill } from '@/lib/billplz';
import { getActivePromotions } from '@/lib/data';
import { applyPromotion } from '@/lib/promotions';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function generateOrderNo() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DH${y}${m}${d}${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId, productName, price, quantity,
      customerName, customerEmail, customerPhone,
      shippingAddress, shippingCity, shippingState, shippingPostcode,
      items, itemsSummary,
    } = body;

    if (!productName || !price || !customerName || !customerPhone) {
      return NextResponse.json({ error: 'Sila isi semua maklumat yang diperlukan.' }, { status: 400 });
    }

    if (!shippingAddress || !shippingCity || !shippingState || !shippingPostcode) {
      return NextResponse.json({ error: 'Sila isi alamat penghantaran.' }, { status: 400 });
    }

    const qty = Math.max(1, Number(quantity) || 1);
    let priceNum = parseFloat(String(price).replace(/[^0-9.]/g, ''));
    if (isNaN(priceNum) || priceNum <= 0) {
      return NextResponse.json({ error: 'Harga tidak sah.' }, { status: 400 });
    }
    // Recalculate with promotions if items provided (use service role to bypass RLS)
    const itemsList = Array.isArray(items) ? items : [];
    if (itemsList.length > 0) {
      const promotions = await getActivePromotions(supabase);
      let total = 0;
      for (const it of itemsList) {
        const unitPrice = typeof it.price === 'number' ? it.price : parseFloat(String(it.price || 0).replace(/[^0-9.]/g, ''));
        const { finalPrice } = applyPromotion(unitPrice, it.id || '', promotions);
        total += finalPrice * (it.qty || 1);
      }
      priceNum = total;
    }
    const amountCents = Math.round(priceNum * 100);

    const orderNo = generateOrderNo();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const desc = itemsSummary
      ? `${orderNo} - ${itemsSummary}`.slice(0, 200)
      : `Order ${orderNo} - ${productName} x${qty}`.slice(0, 200);

    const phone = customerPhone.startsWith('+6') ? customerPhone : `+6${customerPhone}`;

    const { billId, billUrl } = await createBill({
      name: customerName,
      email: customerEmail || '',
      mobile: phone,
      amount: amountCents,
      description: desc,
      callbackUrl: `${appUrl}/api/payment/callback`,
      redirectUrl: `${appUrl}/payment/status`,
      referenceNo: orderNo,
    });

    const fullAddress = [shippingAddress, shippingCity, shippingPostcode, shippingState].filter(Boolean).join(', ');

    await supabase.from('orders').insert({
      order_no: orderNo,
      product_id: productId || null,
      product_name: productName,
      quantity: qty,
      amount_cents: amountCents,
      customer_name: customerName,
      customer_email: customerEmail || '',
      customer_phone: customerPhone,
      shipping_address: fullAddress,
      items: items || null,
      bill_code: billId,
      payment_status: 'pending',
    });

    return NextResponse.json({
      billId,
      paymentUrl: billUrl,
      orderNo,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Payment create error:', message);
    return NextResponse.json({ error: `Gagal cipta pembayaran: ${message}` }, { status: 500 });
  }
}
