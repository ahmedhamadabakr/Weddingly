'use client';

import { motion } from 'framer-motion';
import { Event } from '@/lib/context/app-context';
import { splitNames } from './invite-types';
import { Sparkles, Heart, ChevronDown } from 'lucide-react';

interface InviteHeroProps {
  event: Event;
  guestParam: string | null;
  reducedMotion: boolean;
}

export function InviteHero({ event, guestParam, reducedMotion }: InviteHeroProps) {
  const { name1, name2 } = splitNames(event.title);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8 max-w-3xl mx-auto w-full"
      >
        {guestParam && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-sm font-semibold shadow-md"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>نرحب بحضورك الكريّم: <strong className="font-ruqah-bold text-lg text-slate-900 font-bold">{guestParam}</strong></span>
          </motion.div>
        )}

        <div className="space-y-3">
          <p className="text-amber-800/90 text-lg md:text-xl font-bold font-ruqah-bold tracking-wide">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
          <div className="w-24 h-0.5 mx-auto rounded-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
        </div>

        <div className="py-5">
          {name2 ? (
            <div className="space-y-3">
              <div className="relative inline-block py-1">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-5xl sm:text-7xl md:text-8xl font-bold font-ruqah-bold gold-foil-text leading-normal pt-3 pb-1 px-6"
                >
                  {name1}
                </motion.h1>
                <span className="absolute top-4 -left-2 text-amber-500/70 text-base animate-pulse">✦</span>
              </div>

              <div className="flex items-center justify-center gap-4 my-2">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500" aria-hidden="true" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
              </div>

              <div className="relative inline-block py-1">
                <span className="absolute top-4 -right-2 text-amber-500/70 text-base animate-pulse">✦</span>
                <motion.h1
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl sm:text-7xl md:text-8xl font-bold font-ruqah-bold gold-foil-text leading-normal pt-3 pb-1 px-6"
                >
                  {name2}
                </motion.h1>
              </div>
            </div>
          ) : (
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl sm:text-7xl md:text-8xl font-bold font-ruqah-bold gold-foil-text leading-normal pt-3 pb-1"
            >
              {event.title}
            </motion.h1>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold border border-amber-400/50 bg-amber-100/90 text-amber-900 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>{event.type === 'Wedding' ? 'حفل زفاف مبارك' : event.type === 'Engagement' ? 'حفل خطوبة مبارك' : 'حفل كتب كتاب'}</span>
        </motion.div>

        <motion.div
          animate={reducedMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-1 text-slate-500 pt-8"
        >
          <span className="text-xs font-semibold">اسحب لاستكشاف التفاصيل</span>
          <ChevronDown className="w-4 h-4 text-amber-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}
