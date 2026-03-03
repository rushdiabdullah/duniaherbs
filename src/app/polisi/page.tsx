import Link from 'next/link';
import { getSiteContent } from '@/lib/data';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Polisi — Dunia Herbs',
  description: 'Polisi privasi, cookies, syarat penggunaan (ToS), pemulangan dan penghantaran Dunia Herbs.',
};

const defaultPrivacy = 'Dunia Herbs menghormati privasi pelanggan kami. Maklumat peribadi yang dikumpul (nama, telefon, alamat) hanya digunakan untuk tujuan penghantaran dan komunikasi berkaitan pesanan.\n\nKami tidak akan menjual, menyewa atau berkongsi maklumat peribadi anda kepada pihak ketiga tanpa kebenaran.\n\nData pembayaran diproses melalui gateway pembayaran yang selamat dan tidak disimpan oleh kami.';

const defaultShipping = 'Semenanjung Malaysia: 2–5 hari bekerja.\nSabah & Sarawak: 5–10 hari bekerja.\nSingapura: 3–7 hari bekerja (melalui stockist).\n\nKos penghantaran bergantung kepada lokasi dan berat bungkusan. Penghantaran percuma mungkin ditawarkan untuk pesanan melebihi jumlah tertentu.';

const defaultReturn = 'Pemulangan diterima dalam tempoh 7 hari dari tarikh penerimaan, tertakluk kepada syarat berikut:\n• Produk belum dibuka dan dalam keadaan asal.\n• Bungkusan tidak rosak.\n• Resit atau bukti pembelian disertakan.\n\nUntuk memulakan pemulangan, hubungi kami melalui email admin@duniaherbs.com.my.';

const defaultUsage = 'Semua produk Dunia Herbs adalah untuk kegunaan luaran sahaja.\n\nTidak sesuai untuk bayi dan kanak-kanak kecil.\n\nSila rujuk doktor jika anda mengandung atau mempunyai keadaan kulit yang sensitif sebelum menggunakan produk ini.\n\nHentikan penggunaan jika berlaku kerengsaan kulit.';

const defaultCookie = 'Laman web ini mungkin menyimpan data di peranti anda (cookies atau localStorage) untuk fungsi asas seperti troli beli-belah dan maklumat checkout.\n\n• Data troli & maklumat pelanggan disimpan dalam penyemak imbas anda (localStorage) — hanya untuk memudahkan pembelian anda.\n\n• Kami tidak menggunakan cookies untuk iklan atau penjejakan pihak ketiga.\n\n• Anda boleh kosongkan data dengan mengosongkan troli atau menghapus data laman web dalam tetapan penyemak imbas anda.\n\nUntuk maklumat lanjut, rujuk Polisi Privasi kami.';

const defaultTerms = 'Dengan menggunakan laman web Dunia Herbs (www.duniaherbs.com.my), anda bersetuju dengan syarat-syarat berikut:\n\n1. Penggunaan laman web\nAnda bersetuju menggunakan laman ini untuk tujuan yang sah sahaja. Dilarang menyalahgunakan kandungan, sistem atau maklumat kami.\n\n2. Pesanan & pembayaran\nPesanan tertakluk kepada ketersediaan stok. Harga yang dipaparkan adalah muktamad pada masa checkout. Pembayaran diproses melalui gateway yang selamat (Billplz).\n\n3. Ketepatan maklumat\nAnda bertanggungjawab memastikan maklumat penghantaran dan pembayaran yang diberikan adalah tepat.\n\n4. Had liabiliti\nDunia Herbs tidak bertanggungjawab atas kerosakan tidak langsung akibat penggunaan laman web atau produk. Produk kami untuk kegunaan luaran sahaja — rujuk doktor untuk nasihat kesihatan.\n\n5. Perubahan\nKami berhak mengemas kini polisi dan syarat ini dari semasa ke semasa. Perubahan akan dipaparkan di halaman ini.\n\n6. Undang-undang\nSyarat ini tertakluk kepada undang-undang Malaysia. Sebarang pertikaian akan diselesaikan di mahkamah Malaysia.\n\nHubungi kami: admin@duniaherbs.com.my';

export default async function PolisiPage() {
  const content = await getSiteContent();
  const privacy = content.polisi_privacy || defaultPrivacy;
  const shipping = content.polisi_shipping || defaultShipping;
  const returnPolicy = content.polisi_return || defaultReturn;
  const usage = content.polisi_usage || defaultUsage;
  const cookie = content.polisi_cookie || defaultCookie;
  const terms = content.polisi_terms || defaultTerms;

  return (
    <div className="min-h-screen px-6 py-12 max-w-3xl mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-stone-500 text-sm hover:text-herb-gold transition mb-8"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Kembali
      </Link>

      <h1 className="font-serif text-3xl font-bold text-stone-50 mb-8">Polisi & Syarat</h1>

      <div className="space-y-10">
        <section>
          <h2 className="font-serif text-xl font-semibold text-stone-100 mb-4">Polisi Privasi</h2>
          <div className="rounded-2xl border border-stone-700/50 bg-herb-surface/60 p-6 backdrop-blur-md text-stone-400 text-sm leading-relaxed whitespace-pre-wrap">
            {privacy}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-stone-100 mb-4">Polisi Penghantaran</h2>
          <div className="rounded-2xl border border-stone-700/50 bg-herb-surface/60 p-6 backdrop-blur-md text-stone-400 text-sm leading-relaxed whitespace-pre-wrap">
            {shipping}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-stone-100 mb-4">Polisi Pemulangan</h2>
          <div className="rounded-2xl border border-stone-700/50 bg-herb-surface/60 p-6 backdrop-blur-md text-stone-400 text-sm leading-relaxed whitespace-pre-wrap">
            {returnPolicy}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-stone-100 mb-4">Polisi Cookies</h2>
          <div className="rounded-2xl border border-stone-700/50 bg-herb-surface/60 p-6 backdrop-blur-md text-stone-400 text-sm leading-relaxed whitespace-pre-wrap">
            {cookie}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-stone-100 mb-4">Syarat Penggunaan Laman Web (ToS)</h2>
          <div className="rounded-2xl border border-stone-700/50 bg-herb-surface/60 p-6 backdrop-blur-md text-stone-400 text-sm leading-relaxed whitespace-pre-wrap">
            {terms}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold text-stone-100 mb-4">Syarat Penggunaan Produk</h2>
          <div className="rounded-2xl border border-stone-700/50 bg-herb-surface/60 p-6 backdrop-blur-md text-stone-400 text-sm leading-relaxed whitespace-pre-wrap">
            {usage}
          </div>
        </section>
      </div>

      <p className="mt-12 text-center text-stone-600 text-xs">
        Kemas kini terakhir: {new Date().toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' })}
      </p>
    </div>
  );
}
