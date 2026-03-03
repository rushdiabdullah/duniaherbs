const BASE_URL = process.env.BILLPLZ_BASE_URL || 'https://www.billplz-sandbox.com';
const API_KEY = process.env.BILLPLZ_API_KEY || '';
const COLLECTION_ID = process.env.BILLPLZ_COLLECTION_ID || '';
const X_SIGNATURE_KEY = process.env.BILLPLZ_X_SIGNATURE_KEY || '';

const AUTH_HEADER = 'Basic ' + Buffer.from(API_KEY + ':').toString('base64');

export async function createBill(params: {
  name: string;
  email: string;
  mobile: string;
  amount: number;
  description: string;
  callbackUrl: string;
  redirectUrl: string;
  referenceNo: string;
}) {
  const body = {
    collection_id: COLLECTION_ID,
    email: params.email || '',
    mobile: params.mobile,
    name: params.name,
    amount: params.amount,
    description: params.description.slice(0, 200),
    callback_url: params.callbackUrl,
    redirect_url: params.redirectUrl,
    reference_1_label: 'Order No',
    reference_1: params.referenceNo,
  };

  const res = await fetch(`${BASE_URL}/api/v3/bills`, {
    method: 'POST',
    headers: {
      Authorization: AUTH_HEADER,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok || !data.id) {
    throw new Error(JSON.stringify(data));
  }
  return { billId: data.id as string, billUrl: data.url as string };
}

export async function getBill(billId: string) {
  const res = await fetch(`${BASE_URL}/api/v3/bills/${billId}`, {
    headers: { Authorization: AUTH_HEADER },
  });
  return res.json();
}

export function verifyXSignature(params: Record<string, string>, receivedSignature: string): boolean {
  if (!X_SIGNATURE_KEY) return true;
  const crypto = require('crypto') as typeof import('crypto');

  const filtered = Object.entries(params)
    .filter(([key]) => key !== 'x_signature')
    .sort(([a], [b]) => a.localeCompare(b));

  const sourceString = filtered.map(([k, v]) => `${k}${v}`).join('|');

  const computed = crypto
    .createHmac('sha256', X_SIGNATURE_KEY)
    .update(sourceString)
    .digest('hex');

  return computed === receivedSignature;
}
