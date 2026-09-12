'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/lib/context/app-context';
import { CheckCircle2, Loader2, Users, User, Heart, MessageSquare } from 'lucide-react';

interface RSVPFormProps {
  eventId: string;
  theme?: { primary: string; secondary: string };
  onSubmit?: () => void;
}

export function RSVPForm({ eventId, theme, onSubmit }: RSVPFormProps) {
  const { addGuest } = useAppContext();
  const [name,         setName]         = useState('');
  const [numAttendees, setNumAttendees] = useState(1);
  const [note,         setNote]         = useState('');
  const [submitted,    setSubmitted]    = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');

  const primary   = theme?.primary   ?? '#d4a853';
  const secondary = theme?.secondary ?? '#e8627a';
  const gradient  = `linear-gradient(135deg, ${primary}, ${secondary})`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) { setError('من فضلك أدخل اسمك الكريم'); return; }
    setSubmitting(true);
    try {
      await addGuest(eventId, { name: name.trim(), numAttendees });
      setSubmitted(true);
      onSubmit?.();
    } catch (err: any) {
      setError(err.message ?? 'حدث خطأ أثناء التأكيد، يرجى المحاولة مجدداً');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 px-6 font-normal-text"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-2xl"
          style={{ background: gradient, boxShadow: `0 15px 40px ${primary}40` }}
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">تم تأكيد حضورك بنجاح! 🎉</h3>
        <p className="text-white/70 text-base leading-relaxed">
          أهلاً بك <span className="font-ruqah-bold text-amber-300 text-xl font-bold px-1">{name}</span>، نسعد جداً بوجودكم ومشاركتنا هذه الفرحة المباركة.
        </p>
        <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-white/50 text-xs flex items-center justify-center gap-2">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>تم تسجيل حضور {numAttendees} {numAttendees === 1 ? 'مرافق' : 'ضيوف'}</span>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md mx-auto font-normal-text">
      {/* Name Input */}
      <div>
        <label className="block text-xs font-semibold text-amber-200/70 uppercase tracking-widest mb-2 text-right">
          الاسم الكريم *
        </label>
        <div className="relative">
          <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/50" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل اسمك كاملاً"
            disabled={submitting}
            className="w-full pr-11 pl-4 py-3.5 rounded-xl text-sm text-white placeholder-white/30 disabled:opacity-50 transition-all outline-none font-ruqah-bold text-base"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(212,168,83,0.25)',
            }}
            onFocus={(e) => (e.target.style.borderColor = primary)}
            onBlur={(e)  => (e.target.style.borderColor = 'rgba(212,168,83,0.25)')}
          />
        </div>
      </div>

      {/* Attendees counter */}
      <div>
        <label className="block text-xs font-semibold text-amber-200/70 uppercase tracking-widest mb-2 text-right">
          عدد الأفراد القادمين (بما فيهم أنت)
        </label>
        <div className="flex items-center gap-4 p-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(212,168,83,0.25)' }}>
          <button
            type="button"
            onClick={() => setNumAttendees(Math.max(1, numAttendees - 1))}
            disabled={numAttendees <= 1}
            className="w-10 h-10 rounded-lg text-white/80 hover:text-white font-bold text-xl transition-all disabled:opacity-30 flex items-center justify-center hover:bg-white/10"
          >
            −
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <Users className="w-4 h-4 text-amber-400/70" />
            <span className="text-amber-200 font-extrabold text-2xl">{numAttendees}</span>
            <span className="text-white/60 text-sm">{numAttendees === 1 ? 'شخص' : 'أشخاص'}</span>
          </div>
          <button
            type="button"
            onClick={() => setNumAttendees(Math.min(10, numAttendees + 1))}
            disabled={numAttendees >= 10}
            className="w-10 h-10 rounded-lg text-white/80 hover:text-white font-bold text-xl transition-all disabled:opacity-30 flex items-center justify-center hover:bg-white/10"
          >
            +
          </button>
        </div>
      </div>

      {/* Optional Note / Warm wishes */}
      <div>
        <label className="block text-xs font-semibold text-amber-200/70 uppercase tracking-widest mb-2 text-right">
          كلمة تبريك أو تهنئة للعروسين (اختياري)
        </label>
        <div className="relative">
          <MessageSquare className="absolute right-3.5 top-3.5 w-4 h-4 text-amber-400/50" />
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="اكتب كلمة طيبة أو دعاء للعروسين..."
            disabled={submitting}
            className="w-full pr-11 pl-4 py-3 rounded-xl text-sm text-white placeholder-white/30 disabled:opacity-50 transition-all outline-none font-normal-text resize-none"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(212,168,83,0.25)',
            }}
            onFocus={(e) => (e.target.style.borderColor = primary)}
            onBlur={(e)  => (e.target.style.borderColor = 'rgba(212,168,83,0.25)')}
          />
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-rose-400 text-xs text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Submit button */}
      <button
        type="submit"
        disabled={!name.trim() || submitting}
        className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] shadow-2xl cursor-pointer"
        style={{
          background: gradient,
          boxShadow: `0 10px 35px ${primary}40`,
        }}
      >
        {submitting
          ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري تأكيد الحضور...</>
          : '✨ تأكيد الحضور الآن'
        }
      </button>
    </form>
  );
}
