-- Tambah polisi cookies & Terms of Service

INSERT INTO site_content (id, value) VALUES
  ('polisi_cookie', 'Laman web ini mungkin menyimpan data di peranti anda (cookies atau localStorage) untuk fungsi asas seperti troli beli-belah dan maklumat checkout.

• Data troli & maklumat pelanggan disimpan dalam penyemak imbas anda (localStorage) — hanya untuk memudahkan pembelian anda.

• Kami tidak menggunakan cookies untuk iklan atau penjejakan pihak ketiga.

• Anda boleh kosongkan data dengan mengosongkan troli atau menghapus data laman web dalam tetapan penyemak imbas anda.

Untuk maklumat lanjut, rujuk Polisi Privasi kami.'),
  ('polisi_terms', 'Dengan menggunakan laman web Dunia Herbs (www.duniaherbs.com.my), anda bersetuju dengan syarat-syarat berikut:

1. Penggunaan laman web
Anda bersetuju menggunakan laman ini untuk tujuan yang sah sahaja. Dilarang menyalahgunakan kandungan, sistem atau maklumat kami.

2. Pesanan & pembayaran
Pesanan tertakluk kepada ketersediaan stok. Harga yang dipaparkan adalah muktamad pada masa checkout. Pembayaran diproses melalui gateway yang selamat (Billplz).

3. Ketepatan maklumat
Anda bertanggungjawab memastikan maklumat penghantaran dan pembayaran yang diberikan adalah tepat.

4. Had liabiliti
Dunia Herbs tidak bertanggungjawab atas kerosakan tidak langsung akibat penggunaan laman web atau produk. Produk kami untuk kegunaan luaran sahaja — rujuk doktor untuk nasihat kesihatan.

5. Perubahan
Kami berhak mengemas kini polisi dan syarat ini dari semasa ke semasa. Perubahan akan dipaparkan di halaman ini.

6. Undang-undang
Syarat ini tertakluk kepada undang-undang Malaysia. Sebarang pertikaian akan diselesaikan di mahkamah Malaysia.

Hubungi kami: admin@duniaherbs.com.my')
ON CONFLICT (id) DO NOTHING;
