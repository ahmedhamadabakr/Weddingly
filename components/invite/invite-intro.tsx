'use client';

import { motion } from 'framer-motion';
import { Event } from '@/lib/context/app-context';
import { MUSIC_TRACKS } from '@/lib/music-tracks';
import { splitNames } from './invite-types';
import { RingsMark, Motif } from './invite-helpers';
import { Sparkles, Heart, Music } from 'lucide-react';

interface InviteIntroProps {
  event: Event;
  guestParam: string | null;
  reducedMotion: boolean;
  primaryColor: string;
  secondaryColor: string;
  onOpen: () => void;
}

export function InviteIntro({
  event,
  guestParam,
  reducedMotion,
  primaryColor,
  secondaryColor,
  onOpen,
}: InviteIntroProps) {
  const { name1, name2 } = splitNames(event.title);
  const track = MUSIC_TRACKS.find((t) => t.id === event.musicTrack) ?? MUSIC_TRACKS[1];

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden relative font-normal-text select-none"
      style={{ background: `linear-gradient(160deg, #fffdfa 0%, #f7f3eb 60%, #fffdfa 100%)` }}
    >
      {/* Background glowing lights */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px]" style={{ background: `${primaryColor}20` }} />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[140px]" style={{ background: `${secondaryColor}15` }} />
      </div>

      {Array.from({ length: reducedMotion ? 0 : 7 }).map((_, i) => (
        <Motif key={i} i={i} color={primaryColor} />
      ))}

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg mx-auto"
      >
        <div className="luxury-card-frame p-8 md:p-12 relative overflow-hidden border border-amber-500/40 shadow-2xl bg-white/95">
          <div className="absolute top-3 left-3 text-amber-600/40 text-lg" aria-hidden="true">✦</div>
          <div className="absolute top-3 right-3 text-amber-600/40 text-lg" aria-hidden="true">✦</div>
          <div className="absolute bottom-3 left-3 text-amber-600/40 text-lg" aria-hidden="true">✦</div>
          <div className="absolute bottom-3 right-3 text-amber-600/40 text-lg" aria-hidden="true">✦</div>

          {guestParam && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 px-4 py-2 rounded-full bg-amber-50 border border-amber-500/30 text-amber-900 text-xs inline-flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>دعوة مخصصة للكريّم: <strong className="font-ruqah-bold text-sm text-slate-900">{guestParam}</strong></span>
            </motion.div>
          )}

          <p className="text-amber-800/90 text-sm font-semibold mb-4">دعوة حضور حفل مبارك</p>

          <div className="my-6">
            {name2 ? (
              <div className="space-y-2">
                <div className="relative inline-block py-1">
                  <h1 className="text-4xl md:text-6xl font-bold font-ruqah-bold gold-foil-text leading-normal pt-2 pb-1 px-4">
                    {name1}
                  </h1>
                  <span className="absolute top-2 -left-1 text-amber-500/70 text-xs animate-pulse">✦</span>
                </div>
                <div className="flex items-center justify-center gap-3 my-2 opacity-90">
                  <span className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" aria-hidden="true" />
                  <span className="h-px w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                </div>
                <div className="relative inline-block py-1">
                  <span className="absolute top-2 -right-1 text-amber-500/70 text-xs animate-pulse">✦</span>
                  <h1 className="text-4xl md:text-6xl font-bold font-ruqah-bold gold-foil-text leading-normal pt-2 pb-1 px-4">
                    {name2}
                  </h1>
                </div>
              </div>
            ) : (
              <h1 className="text-4xl md:text-6xl font-bold font-ruqah-bold gold-foil-text leading-normal pt-2 pb-1">
                {event.title}
              </h1>
            )}
          </div>

          <div className="my-6 px-4 py-3 rounded-xl bg-amber-50/60 border border-amber-500/25 text-amber-900 text-xs leading-relaxed italic font-serif">
            ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا ﴾
          </div>

          <div className="mb-8 flex items-center justify-center gap-2 text-slate-600 text-xs font-semibold">
            <Music className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span>الموسيقى: {track.nameAr}</span>
          </div>

          {/* Open button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={onOpen}
            aria-label="افتح الدعوة"
            className="wax-seal-3d w-24 h-24 rounded-full mx-auto flex flex-col items-center justify-center cursor-pointer shadow-2xl transition-all duration-300 group focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-400/60"
          >
            <RingsMark className="w-8 h-5 text-amber-100 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-bold text-amber-100 mt-1.5 font-normal-text">افتح الدعوة</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
