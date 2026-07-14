'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { Amiri, Reem_Kufi } from 'next/font/google';
import { Event } from '@/lib/context/app-context';
import { RSVPForm } from '@/components/rsvp-form';
import { MUSIC_TRACKS } from '@/lib/music-tracks';
import { Volume2, VolumeX, MapPin, Calendar, Clock, Heart, ChevronDown } from 'lucide-react';

const amiri  = Amiri({ subsets: ['arabic'], weight: ['400', '700'] });
const ruqaa  = Reem_Kufi({ subsets: ['arabic'], weight: ['400', '700'] });

/* ───── helpers ───── */
const splitNames = (title: string) => {
  for (const sep of [' & ', ' and ', '&']) {
    if (title.includes(sep)) {
      const [a, b] = title.split(sep).map((s) => s.trim());
      return { name1: a, name2: b };
    }
  }
  return { name1: title, name2: '' };
};

const arDate = (d: Date) =>
  new Date(d).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const arTime = (d: Date) =>
  new Date(d).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

/* ───── Particle ───── */
const Particle = ({ i, color }: { i: number; color: string }) => (
  <motion.div
    className="fixed pointer-events-none z-0 select-none text-xl"
    style={{ left: `${(i * 13 + 5) % 95}vw` }}
    initial={{ y: '110vh', opacity: 0 }}
    animate={{ y: '-10vh', opacity: [0, 0.6, 0.6, 0] }}
    transition={{ duration: 10 + (i % 5) * 2, repeat: Infinity, ease: 'linear', delay: i * 0.7 }}
  >
    <span style={{ color }}>❤</span>
  </motion.div>
);

/* ───── Section wrapper ───── */
const Section = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, ease: 'easeOut' }}
    className={`relative z-10 ${className}`}
  >
    {children}
  </motion.section>
);

/* ═══════════════════════════════════════════════════════ */
export default function InvitationPage() {
  const params = useParams();
  const slug   = params.slug as string;

  const [event,      setEvent]      = useState<Event | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [opened,     setOpened]     = useState(false);
  const [playing,    setPlaying]    = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { scrollYProgress } = useScroll();
  const scrollBarScale      = useTransform(scrollYProgress, [0, 1], [0, 1]);

  /* ── Fetch event from API ── */
  useEffect(() => {
    fetch(`/api/events/slug/${slug}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.event) {
          setEvent({
            ...data.event,
            id:        data.event._id ?? data.event.id,
            dateTime:  new Date(data.event.dateTime),
            createdAt: new Date(data.event.createdAt),
            guests:    (data.event.guests ?? []).map((g: any) => ({
              ...g,
              eventId:   data.event._id ?? data.event.id,
              timestamp: new Date(g.timestamp),
            })),
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  /* ── audio setup — custom URL takes priority over library ── */
  useEffect(() => {
    if (!event) return;
    const url = event.customMusicUrl
      ? event.customMusicUrl
      : (MUSIC_TRACKS.find((t) => t.id === event.musicTrack)?.url ?? '/music.mp3');
    const audio = new Audio(url);
    audio.loop  = true;
    audio.addEventListener('canplaythrough', () => setAudioReady(true));
    audioRef.current = audio;
    return () => { audio.pause(); };
  }, [event?.musicTrack, event?.customMusicUrl]);

  const handleOpen = () => {
    setOpened(true);
    audioRef.current?.play().then(() => setPlaying(true)).catch(() => {});
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

  /* ── loading / not found ── */
  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#060a14] text-white gap-4">
        <div className="w-10 h-10 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
        <p className="text-white/30 text-sm">جاري تحميل الدعوة...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#060a14] text-white gap-4">
        <div className="text-6xl">💌</div>
        <p className="text-white/50 text-lg">الدعوة غير موجودة</p>
      </div>
    );
  }

  const primary   = event.theme?.primary   ?? '#e8627a';
  const secondary = event.theme?.secondary ?? '#f43f5e';
  const gradient  = `linear-gradient(135deg, ${primary}, ${secondary})`;
  const track     = MUSIC_TRACKS.find((t) => t.id === event.musicTrack) ?? MUSIC_TRACKS[1];
  const { name1, name2 } = splitNames(event.title);
  const inviteUrl = typeof window !== 'undefined' ? window.location.href : '';

  /* ══════════════════════════════════════════
     🎬 INTRO SCREEN
  ══════════════════════════════════════════ */
  if (!opened) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden relative ${ruqaa.className}`}
        style={{ background: `linear-gradient(160deg, #060a14 0%, #0d0618 60%, #060a14 100%)` }}
      >
        {/* Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px]" style={{ background: `${primary}18` }} />
          <div className="absolute bottom-[-15%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[140px]" style={{ background: `${secondary}12` }} />
        </div>

        {/* Floating particles */}
        {Array.from({ length: 12 }).map((_, i) => <Particle key={i} i={i} color={primary} />)}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 space-y-8 max-w-lg"
        >
          {/* Icon */}
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl shadow-2xl"
            style={{ background: gradient, boxShadow: `0 20px 60px ${primary}40` }}
          >
            💍
          </motion.div>

          <div className="space-y-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/40 text-base tracking-widest"
            >
              دعوة حضور
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl md:text-5xl font-bold"
              style={{
                background: gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {event.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-white/40 text-sm"
            >
              يسعدنا دعوتكم لمشاركتنا فرحتنا
            </motion.p>
          </div>

          {/* Ayah */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="px-6 py-4 rounded-2xl text-white/50 text-sm leading-loose italic"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا ﴾
          </motion.div>

          {/* Music info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center justify-center gap-2 text-white/30 text-xs"
          >
            <span>{track.emoji}</span>
            <span>{track.nameAr}</span>
          </motion.div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.3 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleOpen}
            className="px-12 py-4 rounded-2xl font-bold text-white text-lg shadow-2xl transition-shadow"
            style={{ background: gradient, boxShadow: `0 12px 40px ${primary}40` }}
          >
            افتح الدعوة ✨
          </motion.button>
        </motion.div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     📜 MAIN INVITATION
  ══════════════════════════════════════════ */
  return (
    <main
      className={`relative overflow-x-hidden ${amiri.className}`}
      style={{ background: `linear-gradient(160deg, #060a14 0%, #0d0618 50%, #060a14 100%)` }}
    >
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left"
        style={{ scaleX: scrollBarScale, background: gradient }}
      />

      {/* Particles */}
      {Array.from({ length: 15 }).map((_, i) => <Particle key={i} i={i} color={primary} />)}

      {/* Global ambient blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[180px]" style={{ background: `${primary}08` }} />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px]" style={{ background: `${secondary}08` }} />
      </div>

      {/* Music toggle */}
      <button
        onClick={toggleMusic}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-200 hover:scale-110"
        style={{ background: gradient, boxShadow: `0 8px 30px ${primary}50` }}
      >
        <motion.div
          animate={playing ? { rotate: [0, 360] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          {playing ? <Volume2 className="w-6 h-6 text-white" /> : <VolumeX className="w-6 h-6 text-white/70" />}
        </motion.div>
      </button>

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="space-y-6 max-w-2xl"
        >
          {/* Decorative line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 60, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="h-px mx-auto rounded-full"
            style={{ background: gradient }}
          />

          <p className="text-white/35 text-lg tracking-widest">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

          {/* Names */}
          {name2 ? (
            <div className={`space-y-2 ${ruqaa.className}`}>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-5xl md:text-7xl font-bold"
                style={{ background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                {name1}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white/30 text-3xl"
              >
                &amp;
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                className="text-5xl md:text-7xl font-bold"
                style={{ background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
              >
                {name2}
              </motion.h1>
            </div>
          ) : (
            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className={`text-5xl md:text-7xl font-bold ${ruqaa.className}`}
              style={{ background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              {event.title}
            </motion.h1>
          )}

          {/* Type badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium mx-auto"
            style={{ background: `${primary}18`, border: `1px solid ${primary}30`, color: primary }}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            {event.type === 'Wedding' ? 'حفل زفاف' : event.type === 'Engagement' ? 'حفل خطوبة' : 'حفل كتب كتاب'}
          </motion.div>

          {/* Host */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-white/40 text-base"
          >
            من تنظيم: <span className="text-white/70">{event.hostName}</span>
          </motion.p>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 8, 0] }}
            transition={{ delay: 1.5, y: { duration: 2, repeat: Infinity } }}
            className="flex flex-col items-center gap-1 text-white/20 mt-4"
          >
            <span className="text-xs">اسحب للأسفل</span>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── COVER IMAGE (if exists) ── */}
      {event.coverImage && (
        <Section className="px-6 pb-10">
          <div className="max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: `0 30px 80px ${primary}20` }}>
            <img src={event.coverImage} alt={event.title} className="w-full object-cover max-h-[500px]" />
          </div>
        </Section>
      )}

      {/* ── MESSAGE ── */}
      {event.message && (
        <Section className="min-h-[60vh] flex items-center justify-center px-6 py-20">
          <div
            className="max-w-2xl mx-auto text-center p-10 rounded-3xl space-y-6"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="text-4xl">💌</div>
            <p className="text-white/70 text-xl leading-loose" style={{ fontFamily: 'inherit' }}>
              {event.message}
            </p>
            <div className="w-16 h-px mx-auto rounded-full" style={{ background: gradient }} />
            <p className={`text-white/40 text-base ${ruqaa.className}`}>
              الفرحة لا تكتمل إلا بوجود الأهل والأحباب
            </p>
          </div>
        </Section>
      )}

      {/* ── DATE & TIME ── */}
      <Section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <h2 className={`text-4xl font-bold text-white/80 ${ruqaa.className}`}>موعدنا المنتظر</h2>

          <div
            className="rounded-3xl p-10 space-y-6"
            style={{
              background: `linear-gradient(135deg, ${primary}12, ${secondary}12)`,
              border: `1px solid ${primary}25`,
              boxShadow: `0 20px 60px ${primary}15`,
            }}
          >
            {/* Date */}
            <div className="flex items-center justify-center gap-3">
              <div className="p-2.5 rounded-xl" style={{ background: `${primary}20` }}>
                <Calendar className="w-5 h-5" style={{ color: primary }} />
              </div>
              <div className="text-right">
                <p className="text-white/35 text-xs mb-1">التاريخ</p>
                <p className="text-white text-xl font-bold">{arDate(event.dateTime)}</p>
              </div>
            </div>

            <div className="w-full h-px" style={{ background: `${primary}20` }} />

            {/* Time */}
            <div className="flex items-center justify-center gap-3">
              <div className="p-2.5 rounded-xl" style={{ background: `${primary}20` }}>
                <Clock className="w-5 h-5" style={{ color: primary }} />
              </div>
              <div className="text-right">
                <p className="text-white/35 text-xs mb-1">التوقيت</p>
                <p className="text-white text-2xl font-bold">في تمام {arTime(event.dateTime)}</p>
              </div>
            </div>
          </div>

          {/* Countdown-style dots */}
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: primary }}
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* ── LOCATION ── */}
      <Section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-xl mx-auto text-center space-y-8">
          <h2 className={`text-4xl font-bold text-white/80 ${ruqaa.className}`}>مكان الاحتفال</h2>

          <div
            className="rounded-3xl p-10 space-y-4"
            style={{
              background: `linear-gradient(135deg, ${primary}12, ${secondary}12)`,
              border: `1px solid ${primary}25`,
              boxShadow: `0 20px 60px ${primary}15`,
            }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center" style={{ background: gradient }}>
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <p className="text-white text-2xl font-bold leading-relaxed">{event.location}</p>
            <p className="text-white/35 text-sm italic">
              &ldquo;ننتظر إطلالتكم البهية لتنير الحفل&rdquo;
            </p>
          </div>
        </div>
      </Section>

      {/* ── RSVP ── */}
      <Section className="min-h-screen flex items-center justify-center px-6 py-20">
        <div className="max-w-sm mx-auto w-full space-y-8 text-center">
          <div className="space-y-2">
            <h2 className={`text-4xl font-bold text-white/80 ${ruqaa.className}`}>تأكيد الحضور</h2>
            <p className="text-white/35 text-sm">أخبرنا بحضورك لنتمكن من الاستعداد لاستقبالكم</p>
          </div>

          <div
            className="rounded-3xl p-8"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <RSVPForm eventId={event.id} theme={{ primary, secondary }} />
          </div>
        </div>
      </Section>

      {/* ── QR CODE ── */}
      <Section className="min-h-[70vh] flex items-center justify-center px-6 py-20">
        <div className="max-w-sm mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className={`text-3xl font-bold text-white/70 ${ruqaa.className}`}>شارك الدعوة</h2>
            <p className="text-white/30 text-sm">امسح الكود لمشاركة الدعوة مع الأهل والأحباب</p>
          </div>

          <div
            className="p-6 rounded-3xl inline-block mx-auto"
            style={{
              background: 'rgba(255,255,255,0.95)',
              boxShadow: `0 20px 60px ${primary}30`,
            }}
          >
            <QRCode value={inviteUrl} size={180} fgColor="#1a1a2e" bgColor="transparent" />
          </div>

          <p className="text-white/20 text-xs break-all max-w-xs mx-auto">{inviteUrl}</p>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 py-12 text-center space-y-3">
        <div className="flex justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl"
          >
            ❤️
          </motion.div>
        </div>
        <p className="text-white/25 text-sm">صُنعت بكل الحب · Weddingly</p>
        <p className="text-white/15 text-xs">© {new Date().getFullYear()}</p>
      </footer>
    </main>
  );
}