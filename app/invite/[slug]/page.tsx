'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { Event } from '@/lib/context/app-context';
import { RSVPForm } from '@/components/rsvp-form';
import { CountdownTimer } from '@/components/countdown-timer';
import { MUSIC_TRACKS } from '@/lib/music-tracks';
import {
  Volume2, VolumeX, MapPin, Calendar, Clock, Heart, ChevronDown,
  Share2, CalendarPlus, Navigation, Sparkles, CheckCircle, Music, ZoomIn, X, Mail
} from 'lucide-react';

/* ───── Helper: Split Groom & Bride names ───── */
const splitNames = (title: string) => {
  if (!title) return { name1: '', name2: '' };
  
  // 1) Explicit separators with spaces or symbols
  for (const sep of [' & ', ' and ', '&', ' + ', ' و ', ' - ', ' / ', ' | ']) {
    if (title.includes(sep)) {
      const parts = title.split(sep).map((s) => s.trim());
      if (parts[0] && parts[1]) {
        return { name1: parts[0], name2: parts.slice(1).join(` ${sep.trim()} `) };
      }
    }
  }

  // 2) Handle Arabic "اسم1 واسم2" (e.g. "محمود ونرمين") where 'و' has no space before the second name
  const wawMatch = title.match(/^(.+?)\s+و\s*(.+)$/) || title.match(/^(.+?)\s+و(.+)$/);
  if (wawMatch && wawMatch[1] && wawMatch[2]) {
    return { name1: wawMatch[1].trim(), name2: wawMatch[2].trim() };
  }

  // 3) Handle hyphen without spaces "محمود-نرمين"
  if (title.includes('-')) {
    const parts = title.split('-').map((s) => s.trim());
    if (parts[0] && parts[1]) {
      return { name1: parts[0], name2: parts[1] };
    }
  }

  return { name1: title, name2: '' };
};

/* ───── Helper: Date & Time in Arabic ───── */
const arDate = (d: Date) =>
  new Date(d).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const arTime = (d: Date) =>
  new Date(d).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

/* ───── Helper: Download .ics calendar invite ───── */
const downloadICS = (title: string, dateTime: Date, location: string) => {
  const startDate = new Date(dateTime).toISOString().replace(/-|:|\.\d+/g, '');
  const endDate = new Date(new Date(dateTime).getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Weddingly//NONSGML Invitation//AR',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    'DESCRIPTION:ننتظر إطلالتكم البهية لتنيروا حفلنا المبارك.',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/* ───── Helper: Ensure absolute valid Google Maps URL ───── */
const formatGoogleMapsUrl = (url?: string, location?: string) => {
  if (url && url.trim()) {
    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }
    return cleanUrl;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location || '')}`;
};

/* ───── Monogram Rings (replaces the emoji ring icon everywhere) ─────
   A single, quiet motif reused for the seal and the footer instead of
   two different emoji, so the "boldness" of the page lives in one
   deliberate mark rather than being scattered. */
const RingsMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 48 28" className={className} fill="none" aria-hidden="true">
    <circle cx="18" cy="14" r="10.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="30" cy="14" r="10.5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

/* ───── Ambient Motif (single restrained accent, not a sparkle shower) ───── */
const Motif = ({ i, color }: { i: number; color: string }) => (
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
const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
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

/* ───── Reusable section eyebrow — plain, not tracked-out caps ───── */
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl md:text-4xl font-bold font-ruqah-bold gold-foil-text">{children}</h2>
);

export default function InvitationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const guestParam = searchParams.get('guest');

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { scrollYProgress } = useScroll();
  const scrollBarScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /* ── Respect prefers-reduced-motion ── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* ── Fetch Event & Track View ── */
  useEffect(() => {
    fetch(`/api/events/slug/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.event) {
          const loadedEvent = {
            ...data.event,
            id: data.event._id ?? data.event.id,
            dateTime: new Date(data.event.dateTime),
            createdAt: new Date(data.event.createdAt),
            guests: (data.event.guests ?? []).map((g: any) => ({
              ...g,
              eventId: data.event._id ?? data.event.id,
              timestamp: new Date(g.timestamp),
            })),
          };
          setEvent(loadedEvent);

          // Track View in DB
          const viewKey = `viewed_${loadedEvent.id}`;
          if (!sessionStorage.getItem(viewKey)) {
            sessionStorage.setItem(viewKey, '1');
            fetch(`/api/events/${loadedEvent.id}/view`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ guestName: guestParam || 'زائر' }),
            }).catch(console.error);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug, guestParam]);

  /* ── Audio Setup (cleans up its own listener now) ── */
  useEffect(() => {
    if (!event) return;
    const url = event.customMusicUrl
      ? event.customMusicUrl
      : (MUSIC_TRACKS.find((t) => t.id === event.musicTrack)?.url ?? '/music.mp3');
    const audio = new Audio(url);
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [event?.musicTrack, event?.customMusicUrl]);

  /* ── Close lightbox on Escape ── */
  useEffect(() => {
    if (!isImageOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsImageOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isImageOpen]);

  const handleOpen = () => {
    setOpened(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audioRef.current.pause();
      setPlaying(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`دعوة حضور حفل ${event?.title}\nيسعدنا حضوركم وتشريفكم لنا\n\nرابط الدعوة:\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  /* ── Loading Screen ── */
  if (loading) {
    return (
      <div dir="rtl" className="h-screen flex flex-col items-center justify-center bg-[#faf8f5] text-slate-900 gap-4 font-normal-text">
        <div className="w-11 h-11 border-2 border-amber-600/25 border-t-amber-600 rounded-full animate-spin" />
        <p className="text-amber-800 text-sm tracking-wide animate-pulse font-semibold">جاري تحميل الدعوة...</p>
      </div>
    );
  }

  /* ── Not Found Screen ── */
  if (!event) {
    return (
      <div dir="rtl" className="h-screen flex flex-col items-center justify-center bg-[#faf8f5] text-slate-900 gap-4 font-normal-text">
        <Mail className="w-10 h-10 text-amber-700/70" aria-hidden="true" />
        <p className="text-slate-600 text-lg font-bold">عذراً، هذه الدعوة غير موجودة</p>
      </div>
    );
  }

  const primary   = event.theme?.primary   ?? '#d4a853';
  const secondary = event.theme?.secondary ?? '#e8627a';
  const gradient  = `linear-gradient(135deg, ${primary}, ${secondary})`;
  const track     = MUSIC_TRACKS.find((t) => t.id === event.musicTrack) ?? MUSIC_TRACKS[1];
  const { name1, name2 } = splitNames(event.title);
  const inviteUrl = typeof window !== 'undefined' ? window.location.href : '';
  const motifCount = reducedMotion ? 0 : 8;

  /* ══════════════════════════════════════════════════════════
     🎬 INTRO ENVELOPE SCREEN
  ══════════════════════════════════════════════════════════ */
  if (!opened) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden relative font-normal-text select-none"
        style={{ background: `linear-gradient(160deg, #fffdfa 0%, #f7f3eb 60%, #fffdfa 100%)` }}
      >
        {/* Background glowing lights */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px]" style={{ background: `${primary}20` }} />
          <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[140px]" style={{ background: `${secondary}15` }} />
        </div>

        {Array.from({ length: reducedMotion ? 0 : 7 }).map((_, i) => <Motif key={i} i={i} color={primary} />)}

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

            {/* Open button — a quiet rings mark instead of an emoji */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleOpen}
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

  /* ══════════════════════════════════════════════════════════
     📜 MAIN INVITATION PAGE
  ══════════════════════════════════════════════════════════ */
  return (
    <main
      dir="rtl"
      className="relative overflow-x-hidden min-h-screen text-slate-900 font-normal-text selection:bg-amber-500/30 select-none"
      style={{ background: `linear-gradient(160deg, #faf8f5 0%, #f5f0e6 50%, #faf8f5 100%)` }}
    >
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left"
        style={{ scaleX: scrollBarScale, background: gradient }}
      />

      {Array.from({ length: motifCount }).map((_, i) => <Motif key={i} i={i} color={primary} />)}

      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full blur-[190px]" style={{ background: `${primary}15` }} />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[650px] h-[450px] rounded-full blur-[160px]" style={{ background: `${secondary}12` }} />
      </div>

      {/* Floating Audio Controller */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
        <button
          onClick={toggleMusic}
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

      {/* ── HERO ── */}
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

      {/* ── COVER IMAGE ── */}
      {event.coverImage && (
        <Section className="w-full px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <button
              type="button"
              onClick={() => setIsImageOpen(true)}
              aria-label="تكبير الصورة"
              className="relative w-full block rounded-3xl overflow-hidden border border-amber-500/40 shadow-2xl group cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 bg-white"
            >
              <img
                src={event.coverImage}
                alt={event.title}
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
      )}

      {/* ── Image Lightbox ── */}
      <AnimatePresence>
        {isImageOpen && event.coverImage && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="عرض الصورة بالحجم الكامل"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsImageOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsImageOpen(false)}
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
              src={event.coverImage}
              alt={event.title}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── COUNTDOWN ── */}
      <Section className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <SectionTitle>العد التنازلي للموعد</SectionTitle>
          <p className="text-slate-600 text-sm font-bold font-normal-text">المتبقي على حلول لحظتنا السعيدة</p>
          <div className="pt-2">
            <CountdownTimer targetDate={event.dateTime} primaryColor={primary} />
          </div>
        </div>
      </Section>

      {/* ── DATE & TIME ── */}
      <Section className="px-4 py-16">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <SectionTitle>توقيت الحفل</SectionTitle>

          <div className="luxury-card-frame bg-white/95 p-8 md:p-10 space-y-6 border border-amber-500/40 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <div className="p-3 rounded-2xl bg-amber-100 border border-amber-300">
                <Calendar className="w-6 h-6 text-amber-700" aria-hidden="true" />
              </div>
              <div className="text-right flex-1">
                <p className="text-slate-500 text-xs mb-1 font-bold">تاريخ اليوم السعيد</p>
                <p className="text-slate-900 text-xl font-bold font-normal-text">{arDate(event.dateTime)}</p>
              </div>
            </div>

            <div className="w-full h-px bg-amber-200/60" />

            <div className="flex items-center justify-between gap-4">
              <div className="p-3 rounded-2xl bg-amber-100 border border-amber-300">
                <Clock className="w-6 h-6 text-amber-700" aria-hidden="true" />
              </div>
              <div className="text-right flex-1">
                <p className="text-slate-500 text-xs mb-1 font-bold">توقيت الاستقبال</p>
                <p className="text-amber-800 text-2xl font-bold font-normal-text">في تمام {arTime(event.dateTime)}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-amber-200/60">
              <button
                onClick={() => downloadICS(event.title, event.dateTime, event.location)}
                className="w-full py-3.5 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300 text-amber-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 shadow-sm"
              >
                <CalendarPlus className="w-4 h-4 text-amber-700" aria-hidden="true" />
                <span>إضافة المناسبة إلى التقويم</span>
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── LOCATION & MAPS ── */}
      <Section className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <SectionTitle>موقع الاحتفال</SectionTitle>

          <div className="luxury-card-frame bg-white/95 p-6 md:p-10 space-y-6 border border-amber-500/40 shadow-xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center shadow-xl">
              <MapPin className="w-8 h-8 text-white" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <p className="text-slate-500 text-xs font-bold">عنوان القاعة / المكان</p>
              <p className="text-slate-900 text-2xl font-bold leading-relaxed font-normal-text">{event.location}</p>
            </div>

            <p className="text-amber-900/90 text-sm italic font-semibold">
              &ldquo;ننتظر إطلالتكم الميمونة لتزيدوا حفلنا إشراقاً وأنساً&rdquo;
            </p>

            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-amber-300 shadow-inner my-4 relative">
              <iframe
                title="خريطة الموقع"
                width="100%"
                height="100%"
                className="w-full h-full border-0 transition-all duration-500"
                loading="lazy"
                allowFullScreen
                src={`https://maps.google.com/maps?q=${encodeURIComponent(event.googleMapsUrl || event.location)}&output=embed`}
              />
            </div>

            <div className="pt-4 border-t border-amber-200/60">
              <a
                href={formatGoogleMapsUrl(event.googleMapsUrl, event.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
              >
                <Navigation className="w-5 h-5 text-slate-950 fill-slate-950" aria-hidden="true" />
                <span>افتح الموقع على خرائط Google</span>
              </a>
            </div>
          </div>
        </div>
      </Section>

      {/* ── RSVP ── */}
      <Section className="px-4 py-16">
        <div className="max-w-md mx-auto space-y-6 text-center">
          <div className="space-y-2">
            <SectionTitle>تأكيد الحضور</SectionTitle>
            <p className="text-slate-600 text-sm font-bold font-normal-text">لطفاً أكّدوا حضوركم المبارك ليتسنى لنا حسن الاستقبال</p>
          </div>

          <div className="luxury-card-frame bg-white/95 p-8 border border-amber-500/40 shadow-xl">
            <RSVPForm eventId={event.id} theme={{ primary, secondary }} />
          </div>
        </div>
      </Section>

      {/* ── DIGITAL PASS & QR ── the one place we let the design be bold */}
      <Section className="px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="space-y-2">
            <SectionTitle>بطاقة الحضور الرقمية</SectionTitle>
            <p className="text-slate-600 text-xs font-bold font-normal-text">امسح الكود أو شارك الرابط مع الأحباب</p>
          </div>

          <div className="relative rounded-[28px] bg-slate-950 text-white p-8 shadow-2xl overflow-hidden">
            {/* perforated ticket-stub edge */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-[-8px] pointer-events-none">
              <div className="w-6 h-6 rounded-full bg-[#faf8f5] -translate-x-1/2" />
              <div className="w-6 h-6 rounded-full bg-[#faf8f5] translate-x-1/2" />
            </div>
            <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-[28px]" />

            <div className="relative p-4 rounded-2xl bg-white inline-block mx-auto shadow-md">
              <QRCode value={inviteUrl} size={160} fgColor="#0f172a" bgColor="#ffffff" />
            </div>

            <p className="relative mt-6 text-amber-200/90 text-xs font-mono break-all bg-white/5 p-2.5 rounded-lg border border-white/10">
              {inviteUrl}
            </p>

            <div className="relative grid grid-cols-2 gap-3 pt-6">
              <button
                onClick={handleShareWhatsApp}
                aria-label="مشاركة عبر واتساب"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
              >
                <Share2 className="w-4 h-4" aria-hidden="true" />
                <span>واتساب</span>
              </button>

              <button
                onClick={handleCopyLink}
                aria-label={copied ? 'تم نسخ الرابط' : 'نسخ الرابط'}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-amber-100 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" /> : <Share2 className="w-4 h-4 text-amber-200" aria-hidden="true" />}
                <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-12 text-center space-y-3 font-normal-text border-t border-amber-200/80 bg-[#f7f3eb]">
        <div className="flex justify-center text-amber-700/70">
          <RingsMark className="w-9 h-5" />
        </div>
        <p className="text-amber-900 text-sm font-ruqah-bold font-bold">صُمّمت بكل حب وأناقة بواسطة Weddingly</p>
        <Link href={`/login?from=/dashboard/events/${event.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/5 hover:bg-amber-900/10 text-amber-900/70 hover:text-amber-900 text-xs font-semibold transition-colors">
          <Lock className="w-3.5 h-3.5" />
          <span>لوحة إدارة ومتابعة هذه الدعوة 🔑</span>
        </Link>
        <p className="text-slate-500 text-xs pt-1">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}