import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createToyyibBill } from '@/lib/toyyibpay';
import { getActivePromotions } from '@/lib/data';
import { applyPromotion } from '@/lib/promotions';

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function generateOrderNo() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DH${y}${m}${d}${rand}`;
}

/** `product_id` references products(id); must be real UUID or null. */
function toOrderProductId(raw: unknown): string | null {
  if (raw == null || raw === '') return null;
  const s = String(raw);
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)) {
    return null;
  }
  return s;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.TOYYIBPAY_USER_SECRET_KEY?.trim() || !process.env.TOYYIBPAY_CATEGORY_CODE?.trim()) {
      return NextResponse.json(
        { error: 'ToyyibPay belum lengkap: isi TOYYIBPAY_CATEGORY_CODE (dan secret key) dalam .env.local' },
        { status: 503 },
      );
    }

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
    const supabase = getSupabase();
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

    const { billCode, paymentUrl } = await createToyyibBill({
      name: customerName,
      email: customerEmail || '',
      mobile: phone,
      amountCents,
      description: desc,
      callbackUrl: `${appUrl}/api/payment/callback`,
      returnUrl: `${appUrl}/payment/status`,
      orderReference: orderNo,
    });

    const fullAddress = [shippingAddress, shippingCity, shippingPostcode, shippingState].filter(Boolean).join(', ');

    const safeProductId = toOrderProductId(productId);

    const row = {
      order_no: orderNo,
      product_id: safeProductId,
      product_name: productName,
      quantity: qty,
      amount_cents: amountCents,
      customer_name: customerName,
      customer_email: customerEmail || '',
      customer_phone: customerPhone,
      shipping_address: fullAddress,
      items: items || null,
      bill_code: billCode,
      payment_status: 'pending' as const,
    };

    let insertError = (await supabase.from('orders').insert(row)).error;

    const fkMismatch =
      !!insertError &&
      (insertError.code === '23503' ||
        /foreign key|violates foreign key/i.test(insertError.message || ''));

    if (fkMismatch && safeProductId) {
      console.warn('Order insert FK failed; retry without product_id', insertError?.message);
      insertError = (await supabase.from('orders').insert({ ...row, product_id: null })).error;
    }

    if (insertError) {
      console.error('Order insert error:', insertError.message, insertError);
      return NextResponse.json(
        { error: 'Gagal simpan pesanan. Cuba semula atau hubungi admin.', detail: insertError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      billId: billCode,
      paymentUrl,
      orderNo,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Payment create error:', message);
    return NextResponse.json({ error: `Gagal cipta pembayaran: ${message}` }, { status: 500 });
  }
}
