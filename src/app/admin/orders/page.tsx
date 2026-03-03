'use client';

import AdminShell from '@/components/admin/AdminShell';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import { useEffect, useState } from 'react';

type Order = {
  id: string;
  order_no: string;
  product_name: string;
  quantity: number;
  amount_cents: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  bill_code: string;
  payment_status: string;
  payment_ref: string;
  payment_channel: string;
  payment_time: string;
  shipping_address: string;
  items: { id: string; name: string; price: number; qty: number }[] | null;
  created_at: string;
};

const statusStyles: Record<string, string> = {
  paid: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabel: Record<string, string> = {
  paid: 'Berjaya',
  pending: 'Menunggu',
  failed: 'Gagal',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  async function fetchOrders() {
    const supabase = getSupabaseBrowser();
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200);
    if (filter !== 'all') query = query.eq('payment_status', filter);
    const { data } = await query;
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { setLoading(true); fetchOrders(); }, [filter]);

  const totalPaid = orders.filter((o) => o.payment_status === 'paid').reduce((sum, o) => sum + o.amount_cents, 0);
  const totalPending = orders.filter((o) => o.payment_status === 'pending').length;

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-stone-100">Pesanan</h1>
          <p className="text-stone-500 text-xs mt-1">Semua pesanan melalui Billplz</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="rounded-lg border border-green-700/30 bg-green-900/10 px-3 py-2 text-green-400">
            Berjaya: RM {(totalPaid / 100).toFixed(2)}
          </div>
          <div className="rounded-lg border border-amber-700/30 bg-amber-900/10 px-3 py-2 text-amber-400">
            Menunggu: {totalPending}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['all', 'paid', 'pending', 'failed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs transition ${filter === f ? 'bg-herb-gold/20 text-herb-gold border border-herb-gold/50' : 'text-stone-500 border border-stone-700 hover:text-stone-300'}`}
          >
            {f === 'all' ? 'Semua' : statusLabel[f] || f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-stone-500 text-sm py-8 text-center">Memuatkan...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-stone-700 bg-herb-surface/60 py-12 text-center">
          <p className="text-stone-500 text-sm">Tiada pesanan {filter !== 'all' ? `(${statusLabel[filter]})` : ''}</p>
        </div>
      ) : (
        <div className="rounded-xl border border-stone-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-herb-surface/80 text-stone-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Order</th>
                  <th className="text-left px-4 py-3 font-medium">Produk</th>
                  <th className="text-left px-4 py-3 font-medium">Pelanggan</th>
                  <th className="text-right px-4 py-3 font-medium">Jumlah</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Tarikh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-herb-surface/40 transition">
                    <td className="px-4 py-3">
                      <p className="text-stone-200 font-mono text-xs">{order.order_no}</p>
                      {order.bill_code && <p className="text-stone-600 text-[10px]">{order.bill_code}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {order.items && order.items.length > 0 ? (
                        order.items.map((item, i) => (
                          <p key={i} className="text-stone-200 text-xs">{item.name} <span className="text-stone-500">x{item.qty}</span></p>
                        ))
                      ) : (
                        <>
                          <p className="text-stone-200 text-xs">{order.product_name}</p>
                          {order.quantity > 1 && <p className="text-stone-500 text-[10px]">x{order.quantity}</p>}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-stone-200 text-xs">{order.customer_name}</p>
                      <p className="text-stone-500 text-[10px]">{order.customer_phone}</p>
                      {order.customer_email && <p className="text-stone-600 text-[10px]">{order.customer_email}</p>}
                      {order.shipping_address && <p className="text-stone-600 text-[10px] mt-1">{order.shipping_address}</p>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-herb-gold text-xs font-semibold">RM {(order.amount_cents / 100).toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${statusStyles[order.payment_status] || 'text-stone-500 border-stone-700'}`}>
                        {statusLabel[order.payment_status] || order.payment_status}
                      </span>
                      {order.payment_ref && <p className="text-stone-600 text-[10px] mt-0.5">{order.payment_ref}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-stone-400 text-[10px]">
                        {new Date(order.created_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-stone-600 text-[10px]">
                        {new Date(order.created_at).toLocaleTimeString('ms-MY', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
