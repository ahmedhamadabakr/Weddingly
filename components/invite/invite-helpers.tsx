'use client';

import React from 'react';
import { motion } from 'framer-motion';

/* ───── Monogram Rings ───── */
export const RingsMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 48 28" className={className} fill="none" aria-hidden="true">
    <circle cx="18" cy="14" r="10.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="30" cy="14" r="10.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/* ───── Ambient Motif ───── */
export const Motif = ({ i, color }: { i: number; color: string }) => (
  <motion.div
    className="fixed pointer-events-none z-0 select-none text-lg opacity-40"
    style={{ left: `${(i * 23 + 9) % 92}vw`, color }}
    initial={{ y: '110vh', opacity: 0 }}
    animate={{ y: '-10vh', opacity: [0, 0.4, 0.4, 0] }}
    transition={{ duration: 16 + (i % 3) * 4, repeat: Infinity, ease: 'linear', delay: i * 1.1 }}
  >
    ✦
  </motion.div>
);

/* ───── Section Container ───── */
export const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className={`relative z-10 ${className}`}
  >
    {children}
  </motion.section>
);

/* ───── Section Title ───── */
export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl md:text-4xl font-bold font-ruqah-bold gold-foil-text">{children}</h2>
);
