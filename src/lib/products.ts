export type Product = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  badge?: string;
  heat?: string;
  size: string;
  description: string;
  benefits: string[];
  usage: string;
};

export const products: Product[] = [
  {
    id: '1',
    name: 'Lotion Mustajab Pati Halia',
    tagline: 'Multi-purpose • Sesuai ibu bersalin',
    price: 'RM 22.90',
    badge: 'Bestseller',
    heat: 'Mild',
    size: '130ml',
    description:
      'Lotion Mustajab Pati Halia ialah produk perintis Dunia Herbs yang telah menjadi kegemaran ramai selama lebih 20 tahun. Formula pati halia semula jadi yang mudah diserap, tidak berminyak dan sesuai untuk seluruh keluarga termasuk ibu bersalin.',
    benefits: [
      'Membantu melegakan ketidakselesaan sendi & otot',
      'Sesuai untuk urutan postpartum',
      'Kurangkan kembung perut',
      'Mudah diserap, tidak berminyak',
    ],
    usage: 'Sapu pada bahagian yang dikehendaki — sendi, otot atau abdomen. Untuk luaran sahaja. Tidak sesuai untuk bayi.',
  },
  {
    id: '2',
    name: 'Lotion Mustajab Lime & Ginger',
    tagline: 'Pati halia + limau nipis',
    price: 'RM 22.90',
    heat: 'Mild',
    size: '130ml',
    description:
      'Gabungan pati halia dan limau nipis untuk kesan yang menyegarkan. Multi-purpose lotion yang sesuai untuk sendi, otot dan abdomen.',
    benefits: [
      'Gabungan halia & limau nipis',
      'Segar dan menyegarkan',
      'Membantu melegakan ketidakselesaan sendi & otot',
      'Sesuai untuk seluruh keluarga',
    ],
    usage: 'Sapu pada sendi, otot atau abdomen. Untuk luaran sahaja. Tidak sesuai untuk bayi.',
  },
  {
    id: '3',
    name: 'Lotion Mustajab Super Hot',
    tagline: 'Dengan capsicum • Untuk workout',
    price: 'RM 24.90',
    badge: 'Popular',
    heat: 'Hot',
    size: '130ml',
    description:
      'Diformulasi khas dengan capsicum untuk tahap kehangatan yang lebih tinggi. Sesuai untuk workout, sukan lasak dan mereka yang mahukan kesan haba yang lebih kuat.',
    benefits: [
      'Capsicum untuk haba maksimum',
      'Sesuai untuk workout & sukan',
      'Bantu proses pembakaran lemak',
      'Kehangatan tahan lama',
    ],
    usage: 'Sapu sebelum atau selepas senaman. Untuk luaran sahaja. Elakkan kawasan sensitif.',
  },
  {
    id: '4',
    name: 'Lotion Mustajab Extra Hot',
    tagline: 'Shaping • Extra halia',
    price: 'RM 23.90',
    heat: 'Hot',
    size: '130ml',
    description:
      'Versi extra hot dengan kandungan halia yang lebih pekat. Fokus pada shaping dan pembakaran lemak dengan kehangatan yang berterusan.',
    benefits: [
      'Extra halia untuk kesan lebih kuat',
      'Fokus shaping & pembakaran lemak',
      'Kurangkan penampilan selulit',
      'Kehangatan secara beransur-ansur',
    ],
    usage: 'Sapu pada abdomen dan kawasan yang ingin dibentuk. Untuk luaran sahaja.',
  },
  {
    id: '5',
    name: 'Lotion Mustajab Extreme Hot',
    tagline: 'Kepanasan maksimum • Untuk sukan lasak',
    price: 'RM 25.90',
    badge: 'Terbaru',
    heat: 'Extreme',
    size: '130ml',
    description:
      'Tahap kehangatan paling tinggi dalam rangkaian Mustajab. Diformulasi untuk atlet dan peminat sukan lasak yang memerlukan kesan haba yang intens.',
    benefits: [
      'Kehangatan tahap maksimum',
      'Untuk sukan lasak & atlet',
      'Pembakaran lemak intensif',
      'Legakan otot selepas senaman berat',
    ],
    usage: 'Sapu pada otot sebelum/selepas sukan lasak. Untuk luaran sahaja. Elakkan kawasan sensitif.',
  },
  {
    id: '6',
    name: 'Lotion Mustajab Extra Ginger',
    tagline: 'Halia berganda • Kehidupan aktif',
    price: 'RM 23.90',
    heat: 'Hot',
    size: '130ml',
    description:
      'Mengandungi halia berganda untuk mereka yang menjalani kehidupan aktif. Kehangatan yang berpanjangan tanpa rasa berminyak.',
    benefits: [
      'Halia berganda untuk kesan lebih',
      'Sesuai untuk kehidupan aktif',
      'Tidak berminyak, mudah diserap',
      'Kehangatan berpanjangan',
    ],
    usage: 'Sapu pada sendi dan otot. Untuk luaran sahaja.',
  },
  {
    id: '7',
    name: 'Lotion Mustajab Pati Halia 65ml',
    tagline: 'Saiz mini • Travel size',
    price: 'RM 14.90',
    badge: 'Jimat',
    heat: 'Mild',
    size: '65ml',
    description:
      'Produk Pati Halia saiz mini 65ml. Limited — bukan semua jenis ada. Senang bawa, sesuai try dulu atau travel.',
    benefits: [
      'Saiz mini 65ml',
      'Limited',
      'Formula sama dengan Pati Halia 130ml',
      'Senang bawa',
    ],
    usage: 'Sapu pada sendi, otot atau abdomen. Untuk luaran sahaja. Tidak sesuai untuk bayi.',
  },
  {
    id: '8',
    name: 'Lotion Mustajab Super Hot 65ml',
    tagline: 'Saiz mini • Capsicum workout',
    price: 'RM 15.90',
    heat: 'Hot',
    size: '65ml',
    description:
      'Versi Super Hot saiz mini 65ml. Limited. Capsicum untuk kehangatan maksimum, senang bawa.',
    benefits: [
      'Saiz mini 65ml',
      'Limited',
      'Capsicum untuk haba kuat',
      'Travel size',
    ],
    usage: 'Sapu sebelum atau selepas senaman. Untuk luaran sahaja. Elakkan kawasan sensitif.',
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
