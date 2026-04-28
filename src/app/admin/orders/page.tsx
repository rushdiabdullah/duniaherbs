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
  delivery_status?: string;
  tracking_number?: string | null;
  shipped_at?: string | null;
};

const statusStyles: Record<string, string> = {
  paid: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  failed: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabel: Record<string, string> = {
  paid: 'Berjaya',
  pending: 'Menunggu bayaran',
  failed: 'Gagal',
};

const deliveryLabel: Record<string, string> = {
  pending: 'Belum Hantar',
  shipped: 'Sudah Hantar',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  /** Default "Semua" supaya staf nampak pesanan baru (termasuk menunggu bayaran) tanpa terlepas tab. */
  const [filter, setFilter] = useState<string>('all');
  const [deliveryFilter, setDeliveryFilter] = useState<string>('pending');
  const [shippingModal, setShippingModal] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [shipError, setShipError] = useState('');

  async function fetchOrders() {
    setFetchError('');
    const supabase = getSupabaseBrowser();
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200);
    if (error) {
      console.error('Fetch orders error:', error.message);
      setFetchError(`Gagal muatkan pesanan: ${error.message}`);
    }
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { setLoading(true); fetchOrders(); }, []);

  const paidOrders = orders.filter((o) => o.payment_status === 'paid');
  const toShip = paidOrders.filter((o) => (o.delivery_status || 'pending') === 'pending');
  const shipped = paidOrders.filter((o) => (o.delivery_status || 'pending') === 'shipped');

  const displayOrders =
    filter === 'all'
      ? orders
      : filter === 'paid'
        ? deliveryFilter === 'pending'
          ? toShip
          : shipped
        : orders.filter((o) => o.payment_status === filter);

  const totalPaid = paidOrders.reduce((sum, o) => sum + o.amount_cents, 0);
  const totalPending = orders.filter((o) => o.payment_status === 'pending').length;

  async function handleMarkShipped() {
    if (!shippingModal || !trackingInput.trim()) return;
    setSaving(true);
    setShipError('');
    const supabase = getSupabaseBrowser();
    const { error } = await supabase
      .from('orders')
      .update({
        delivery_status: 'shipped',
        tracking_number: trackingInput.trim(),
        shipped_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', shippingModal.id);
    if (error) {
      console.error(error);
      setShipError(`Gagal simpan: ${error.message}`);
    } else {
      setShippingModal(null);
      setTrackingInput('');
      fetchOrders();
    }
    setSaving(false);
  }

  return (
    <AdminShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-stone-100">Pesanan</h1>
            <p className="text-stone-500 text-xs mt-1">Semua pesanan melalui ToyyibPay — tab &quot;Semua&quot; tunjuk semua status; &quot;Berjaya&quot; untuk urus penghantaran</p>
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

        <div className="rounded-xl border border-herb-gold/20 bg-herb-gold/5 p-4 text-sm">
          <h3 className="font-medium text-herb-gold mb-2">Aliran penghantaran</h3>
          <ul className="space-y-1 text-stone-400">
            <li><strong className="text-stone-300">Pembayaran berjaya</strong> → Order masuk senarai &quot;Berjaya&quot;</li>
            <li><strong className="text-stone-300">Belum hantar</strong> → Klik &quot;Tandakan Hantar&quot;, masukkan no. tracking (Pos Laju, J&amp;T, etc)</li>
            <li><strong className="text-stone-300">Sudah hantar</strong> → Order ditandakan selesai dengan tracking number</li>
          </ul>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-stone-500 text-xs self-center mr-1">Pembayaran:</span>
          {(['all', 'paid', 'pending', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); if (f === 'paid') setDeliveryFilter('pending'); }}
              className={`rounded-lg px-3 py-1.5 text-xs transition ${filter === f ? 'bg-herb-gold/20 text-herb-gold border border-herb-gold/50' : 'text-stone-500 border border-stone-700 hover:text-stone-300'}`}
            >
              {f === 'all' ? 'Semua' : statusLabel[f] || f}
            </button>
          ))}
          {filter === 'paid' && (
            <>
              <span className="text-stone-600 mx-1">|</span>
              <span className="text-stone-500 text-xs self-center">Penghantaran:</span>
              {['pending', 'shipped'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDeliveryFilter(d)}
                  className={`rounded-lg px-3 py-1.5 text-xs transition ${deliveryFilter === d ? 'bg-herb-gold/20 text-herb-gold border border-herb-gold/50' : 'text-stone-500 border border-stone-700 hover:text-stone-300'}`}
                >
                  {deliveryLabel[d] || d}
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      {fetchError && (
        <div className="rounded-xl border border-red-700/40 bg-red-900/10 px-4 py-3 text-sm text-red-400">
          {fetchError}
          <button onClick={fetchOrders} className="ml-3 underline text-red-300 hover:text-red-100">Cuba semula</button>
        </div>
      )}

      {loading ? (
        <p className="text-stone-500 text-sm py-8 text-center">Memuatkan...</p>
      ) : displayOrders.length === 0 ? (
        <div className="rounded-xl border border-stone-700 bg-herb-surface/60 py-12 text-center">
          <p className="text-stone-500 text-sm">
            Tiada pesanan
            {filter === 'all' ? '' : ` (${filter === 'paid' ? statusLabel.paid : statusLabel[filter] || filter})`}
            {filter === 'paid' && ` — ${deliveryLabel[deliveryFilter]}`}
          </p>
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
                  <th className="text-center px-4 py-3 font-medium">Bayaran</th>
                  <th className="text-center px-4 py-3 font-medium">Penghantaran</th>
                  <th className="text-left px-4 py-3 font-medium">Tarikh</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {displayOrders.map((order) => {
                  const isShipped = (order.delivery_status || 'pending') === 'shipped';
                  return (
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
                        {order.payment_status === 'paid' ? (
                          isShipped ? (
                            <div>
                              <span className="inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-medium bg-blue-500/20 text-blue-400 border-blue-500/30">
                                Sudah Hantar
                              </span>
                              {order.tracking_number && (
                                <p className="text-stone-400 text-[10px] mt-1 font-mono">{order.tracking_number}</p>
                              )}
                              {order.shipped_at && (
                                <p className="text-stone-600 text-[10px]">
                                  {new Date(order.shipped_at).toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </p>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => { setShippingModal(order); setTrackingInput(''); }}
                              className="rounded-lg px-2.5 py-1 text-[10px] font-medium bg-herb-gold/20 text-herb-gold border border-herb-gold/50 hover:bg-herb-gold/30 transition"
                            >
                              Tandakan Hantar
                            </button>
                          )
                        ) : (
                          <span className="text-stone-600 text-[10px]">—</span>
                        )}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Masuk tracking number */}
      {shippingModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => !saving && setShippingModal(null)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-stone-700 bg-herb-surface p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-lg font-bold text-stone-100 mb-2">Tandakan Hantar</h2>
            <p className="text-stone-500 text-sm mb-4">
              Order <span className="font-mono text-herb-gold">{shippingModal.order_no}</span> — {shippingModal.customer_name}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-300 mb-1">No. Tracking</label>
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Contoh: EF123456789MY (Pos Laju), JT1234567890 (J&T)"
                className="w-full rounded-xl border border-stone-700 bg-herb-dark px-4 py-2.5 text-stone-100 placeholder-stone-500 focus:border-herb-gold/50 focus:outline-none"
                autoFocus
              />
            </div>
            {shipError && <p className="text-red-400 text-xs mb-3">{shipError}</p>}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { if (!saving) { setShippingModal(null); setShipError(''); } }}
                className="rounded-xl border border-stone-700 px-4 py-2 text-sm text-stone-400 hover:text-stone-200 transition"
              >
                Batal
              </button>
              <button
                onClick={handleMarkShipped}
                disabled={saving || !trackingInput.trim()}
                className="rounded-xl bg-herb-gold/20 border border-herb-gold/50 px-4 py-2 text-sm font-medium text-herb-gold hover:bg-herb-gold/30 transition disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
