import crypto from 'crypto';

const BASE_URL = process.env.TOYYIBPAY_BASE_URL || 'https://toyyibpay.com';
const USER_SECRET_KEY = process.env.TOYYIBPAY_USER_SECRET_KEY || '';
const CATEGORY_CODE = process.env.TOYYIBPAY_CATEGORY_CODE || '';

/** ToyyibPay: bill name max 30 chars — alphanumeric, space, underscore only */
function sanitizeBillName(s: string): string {
  const t = s.replace(/[^a-zA-Z0-9 _]/g, '_').replace(/\s+/g, ' ').trim();
  return (t || 'DuniaHerbs_Order').slice(0, 30);
}

/** ToyyibPay: bill description max 100 chars */
function sanitizeBillDescription(s: string): string {
  const t = s.replace(/[^a-zA-Z0-9 _]/g, '_').replace(/\s+/g, ' ').trim();
  return (t || 'Pembayaran pesanan').slice(0, 100);
}

export type CreateToyyibBillParams = {
  name: string;
  email: string;
  mobile: string;
  amountCents: number;
  description: string;
  callbackUrl: string;
  returnUrl: string;
  /** Our order reference (DH...) — maps to billExternalReferenceNo */
  orderReference: string;
};

/**
 * Create a fixed-amount bill; returns bill code and payment URL.
 * @see https://toyyibpay.com/apireference/
 */
export async function createToyyibBill(params: CreateToyyibBillParams): Promise<{ billCode: string; paymentUrl: string }> {
  if (!USER_SECRET_KEY || !CATEGORY_CODE) {
    throw new Error('TOYYIBPAY_USER_SECRET_KEY dan TOYYIBPAY_CATEGORY_CODE diperlukan dalam env');
  }

  const phone = params.mobile.replace(/\D/g, '').slice(-15) || '0120000000';

  const body = new URLSearchParams();
  body.set('userSecretKey', USER_SECRET_KEY);
  body.set('categoryCode', CATEGORY_CODE);
  body.set('billName', sanitizeBillName(params.name));
  body.set('billDescription', sanitizeBillDescription(params.description));
  body.set('billPriceSetting', '1');
  body.set('billPayorInfo', '1');
  body.set('billAmount', String(params.amountCents));
  body.set('billReturnUrl', params.returnUrl);
  body.set('billCallbackUrl', params.callbackUrl);
  body.set('billExternalReferenceNo', params.orderReference);
  body.set('billTo', sanitizeBillName(params.name).slice(0, 30));
  body.set('billEmail', params.email || 'customer@duniaherbs.com.my');
  body.set('billPhone', phone);
  body.set('billSplitPayment', '0');
  body.set('billPaymentChannel', '0'); // FPX

  const res = await fetch(`${BASE_URL}/index.php/api/createBill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  const text = await res.text();
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`ToyyibPay createBill: bukan JSON — ${text.slice(0, 200)}`);
  }

  const arr = Array.isArray(data) ? data : null;
  const billCode = arr?.[0] && typeof arr[0] === 'object' && arr[0] !== null && 'BillCode' in arr[0]
    ? String((arr[0] as { BillCode: string }).BillCode)
    : '';

  if (!res.ok || !billCode) {
    throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
  }

  const host = BASE_URL.replace(/\/$/, '');
  const paymentUrl = `${host}/${billCode}`;

  return { billCode, paymentUrl };
}

/**
 * Verify ToyyibPay callback hash: MD5(userSecretKey + status + order_id + refno + "ok")
 */
export function verifyToyyibCallback(params: {
  status: string;
  order_id: string;
  refno: string;
  hash: string;
}): boolean {
  if (!USER_SECRET_KEY) return false;
  const expected = crypto
    .createHash('md5')
    .update(`${USER_SECRET_KEY}${params.status}${params.order_id}${params.refno}ok`)
    .digest('hex');
  return expected.toLowerCase() === String(params.hash).toLowerCase();
}
