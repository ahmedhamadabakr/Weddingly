'use client';

import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface InviteAudioPlayerProps {
  playing: boolean;
  reducedMotion: boolean;
  onToggle: () => void;
}

export function InviteAudioPlayer({ playing, reducedMotion, onToggle }: InviteAudioPlayerProps) {
  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
      <button
        onClick={onToggle}
        aria-label={playing ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        title={playing ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
        className="w-14 h-14 rounded-full luxury-card-frame border border-amber-500/40 flex items-center justify-center shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 bg-white/90"
      >
        <motion.div
          className="w-10 h-10 rounded-full bg-slate-900 border border-amber-500/50 flex items-center justify-center relative overflow-hidden"
          animate={playing && !reducedMotion ? { rotate: 360 } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          {playing ? <Volume2 className="w-5 h-5 text-amber-300 z-10" /> : <VolumeX className="w-5 h-5 text-white/50 z-10" />}
        </motion.div>
      </button>
    </div>
  );
}
