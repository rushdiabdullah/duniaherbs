'use client';

import { motion, useReducedMotion } from 'framer-motion';

type AnimateInProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  once?: boolean;
};

export function AnimateIn({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  once = true,
}: AnimateInProps) {
  const reduceMotion = useReducedMotion();
  const offsets = { up: 24, down: -24, left: 24, right: -24 };
  const x = direction === 'left' ? -offsets.left : direction === 'right' ? -offsets.right : 0;
  const y = direction === 'up' ? offsets.up : direction === 'down' ? -offsets.down : 0;

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, x, y }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once, margin: '-50px' }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimateStagger({
  children,
  className = '',
  staggerDelay = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? undefined : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-30px' }}
      variants={{
        visible: { transition: { staggerChildren: reduceMotion ? 0 : staggerDelay } },
        hidden: {},
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function AnimateStaggerItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: reduceMotion ? 0 : 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
