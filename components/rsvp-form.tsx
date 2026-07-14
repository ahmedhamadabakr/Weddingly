'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/lib/context/app-context';
import { CheckCircle2, Loader2, Users, User } from 'lucide-react';

interface RSVPFormProps {
  eventId: string;
  theme?: { primary: string; secondary: string };
  onSubmit?: () => void;
}

export function RSVPForm({ eventId, theme, onSubmit }: RSVPFormProps) {
  const { addGuest } = useAppContext();
  const [name,         setName]         = useState('');
  const [numAttendees, setNumAttendees] = useState(1);
  const [submitted,    setSubmitted]    = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');

  const primary   = theme?.primary   ?? '#e8627a';
  const secondary = theme?.secondary ?? '#f43f5e';
  const gradient  = `linear-gradient(135deg, ${primary}, ${secondary})`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('من فضلك أدخل اسمك'); return; }
    setSubmitting(true);
    try {
      await addGuest(eventId, { name: name.trim(), numAttendees });
      setSubmitted(true);
      onSubmit?.();
    } catch (err: any) {
      setError(err.message ?? 'حدث خطأ، يرجى المحاولة مجدداً');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 px-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background: gradient }}
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">تم تأكيد حضورك! 🎉</h3>
        <p className="text-white/50 text-sm">
          شكراً لك <span className="text-white/80 font-medium">{name}</span>، نتطلع لرؤيتك في الحفل
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-sm mx-auto">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
          اسمك الكريم *
        </label>
        <div className="relative">
          <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسمك كاملاً"
            disabled={submitting}
            className="w-full pr-10 pl-4 py-3.5 rounded-xl text-sm text-white placeholder-white/25 disabled:opacity-50 transition-all outline-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
            onFocus={(e) => (e.target.style.borderColor = primary + '80')}
            onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>
      </div>

      {/* Attendees counter */}
      <div>
        <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">
          عدد الحضور (بما فيهم أنت)
        </label>
        <div className="flex items-center gap-4 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            type="button"
            onClick={() => setNumAttendees(Math.max(1, numAttendees - 1))}
            disabled={numAttendees <= 1}
            className="w-10 h-10 rounded-lg text-white/70 hover:text-white font-bold text-lg transition-colors disabled:opacity-30 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            −
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-white/40" />
            <span className="text-white font-bold text-xl">{numAttendees}</span>
            <span className="text-white/40 text-sm">{numAttendees === 1 ? 'شخص' : 'أشخاص'}</span>
          </div>
          <button
            type="button"
            onClick={() => setNumAttendees(Math.min(10, numAttendees + 1))}
            disabled={numAttendees >= 10}
            className="w-10 h-10 rounded-lg text-white/70 hover:text-white font-bold text-lg transition-colors disabled:opacity-30 flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            +
          </button>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-sm text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit */}
      <button
        type="submit"
        disabled={!name.trim() || submitting}
        className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: gradient,
          boxShadow: `0 8px 30px ${primary}40`,
        }}
      >
        {submitting
          ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري التأكيد...</>
          : '✅ تأكيد حضوري'
        }
      </button>
    </form>
  );
}
