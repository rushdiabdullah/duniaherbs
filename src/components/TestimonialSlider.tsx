'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

const fallbackTestimonials: Testimonial[] = [
  { quote: 'Produk ni memang berkesan. Saya guna untuk ketidakselesaan lutut, lega dalam masa singkat.', author: 'Siti A.', role: 'Pelanggan sejak 2019' },
  { quote: 'Lotion Mustajab pilihan keluarga kami. Halal, selamat dan berkesan.', author: 'Ahmad R.', role: 'Bapa 3 anak' },
];

export function TestimonialSlider() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [current, setCurrent] = useState(0);
  const reduceMotion = useReducedMotion();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    supabase
      .from('testimonials')
      .select('quote, author, role')
      .eq('visible', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) setTestimonials(data);
      });
  }, []);

  const total = testimonials.length;
  const perPage = 2;
  const pages = Math.ceil(total / perPage);

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % pages) + pages) % pages);
  }, [pages]);

  function startAutoSlide() {
    stopAutoSlide();
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % pages);
    }, 5000);
  }

  function stopAutoSlide() {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }

  useEffect(() => {
    if (!reduceMotion) startAutoSlide();
    return stopAutoSlide;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, pages]);

  const visible = testimonials.slice(current * perPage, current * perPage + perPage);

  return (
    <div
      onMouseEnter={stopAutoSlide}
      onMouseLeave={() => { if (!reduceMotion) startAutoSlide(); }}
    >
      <div className="grid md:grid-cols-2 gap-6 min-h-[200px]">
        {visible.map((t, i) => (
          <motion.div
            key={`${current}-${i}`}
            initial={reduceMotion ? undefined : { opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="rounded-2xl border border-blue-950/40 bg-herb-surface/60 p-6 backdrop-blur-md"
          >
            <p className="text-herb-gold/60 text-4xl font-serif leading-none mb-4">&ldquo;</p>
            <p className="text-stone-300 italic leading-relaxed">{t.quote}</p>
            <p className="mt-4 text-herb-gold text-sm font-medium">{t.author}</p>
            <p className="text-stone-500 text-xs">{t.role}</p>
          </motion.div>
        ))}
      </div>

      {/* Dots + arrows */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <button
          onClick={() => goTo(current - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-950/50 text-stone-500 transition hover:border-herb-gold hover:text-herb-gold"
          aria-label="Sebelum"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex gap-2">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-6 bg-herb-gold' : 'w-2 bg-stone-700 hover:bg-stone-500'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={() => goTo(current + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-blue-950/50 text-stone-500 transition hover:border-herb-gold hover:text-herb-gold"
          aria-label="Seterusnya"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
