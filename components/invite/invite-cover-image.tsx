'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Section } from './invite-helpers';
import { getOptimizedImageUrl } from '@/lib/utils';
import { ZoomIn, X } from 'lucide-react';

interface InviteCoverImageProps {
  coverImage?: string;
  title: string;
}

export function InviteCoverImage({ coverImage, title }: InviteCoverImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  /* Close lightbox on Escape key */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  if (!coverImage) return null;

  return (
    <>
      <Section className="w-full px-4 pb-20">
        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="تكبير الصورة"
            className="relative w-full block rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl group cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 bg-white"
          >
            <img
              src={getOptimizedImageUrl(coverImage, 900)}
              alt={title}
              fetchPriority="high"
              decoding="async"
              loading="eager"
              className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-4 inset-x-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-sm border border-amber-400/40 text-amber-100 text-xs font-semibold">
                <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                اضغط للتكبير
              </span>
            </div>
          </button>
        </div>
      </Section>

      {/* Image Lightbox */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="عرض الصورة بالحجم الكامل"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="إغلاق"
              className="absolute top-5 left-5 w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              src={coverImage}
              alt={title}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
