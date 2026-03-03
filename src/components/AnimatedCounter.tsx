'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

type CounterItemProps = {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
};

function CounterItem({ value, suffix = '', label, duration = 2 }: CounterItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setCount(value);
      return;
    }

    let start = 0;
    const step = value / (duration * 60);
    const interval = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [inView, value, duration, reduceMotion]);

  return (
    <div ref={ref} className="text-center">
      <motion.p
        className="font-serif text-4xl md:text-5xl font-bold text-herb-gold"
        initial={reduceMotion ? undefined : { scale: 0.5, opacity: 0 }}
        whileInView={reduceMotion ? undefined : { scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
      >
        {count}
        {suffix}
      </motion.p>
      <p className="text-stone-400 text-sm mt-2 tracking-wide">{label}</p>
    </div>
  );
}

const defaultStats = [
  { value: 20, suffix: '+', label: 'Tahun di Pasaran' },
  { value: 40, suffix: '+', label: 'Stockist Seluruh Dunia' },
  { value: 80, suffix: 'K+', label: 'Pelanggan Setia' },
  { value: 8, suffix: '', label: 'Variasi Produk' },
];

export function AnimatedCounter({ stats }: { stats?: { value: number; suffix?: string; label: string }[] }) {
  const list = stats?.length ? stats : defaultStats;
  return (
    <section className="px-6 py-16">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {list.map((s, i) => (
          <CounterItem
            key={i}
            value={s.value}
            suffix={s.suffix}
            label={s.label}
            duration={1.5}
          />
        ))}
      </div>
    </section>
  );
}
