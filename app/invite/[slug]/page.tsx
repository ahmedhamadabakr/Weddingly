'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Event } from '@/lib/context/app-context';
import { RSVPForm } from '@/components/rsvp-form';
import { CountdownTimer } from '@/components/countdown-timer';
import { MUSIC_TRACKS } from '@/lib/music-tracks';
import { Mail } from 'lucide-react';

import { Motif, Section, SectionTitle } from '@/components/invite/invite-helpers';
import { InviteIntro } from '@/components/invite/invite-intro';
import { InviteHero } from '@/components/invite/invite-hero';
import { InviteCoverImage } from '@/components/invite/invite-cover-image';
import { InviteDateTime } from '@/components/invite/invite-date-time';
import { InviteLocation } from '@/components/invite/invite-location';
import { InviteDigitalPass } from '@/components/invite/invite-digital-pass';
import { InviteAudioPlayer } from '@/components/invite/invite-audio-player';
import { InviteFooter } from '@/components/invite/invite-footer';

export default function InvitationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const guestParam = searchParams.get('guest');

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [playing, setPlaying] = useState(false);
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

  /* ── Audio Setup ── */
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
  const inviteUrl = typeof window !== 'undefined' ? window.location.href : '';
  const motifCount = reducedMotion ? 0 : 8;

  /* ── INTRO ENVELOPE SCREEN ── */
  if (!opened) {
    return (
      <InviteIntro
        event={event}
        guestParam={guestParam}
        reducedMotion={reducedMotion}
        primaryColor={primary}
        secondaryColor={secondary}
        onOpen={handleOpen}
      />
    );
  }

  /* ── MAIN INVITATION PAGE ── */
  return (
    <main
      dir="rtl"
      className="relative overflow-x-hidden min-h-screen text-slate-900 font-normal-text selection:bg-amber-500/30 select-none"
      style={{ background: `linear-gradient(160deg, #faf8f5 0%, #f5f0e6 50%, #faf8f5 100%)` }}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left"
        style={{ scaleX: scrollBarScale, background: gradient }}
      />

      {/* Ambient Motifs */}
      {Array.from({ length: motifCount }).map((_, i) => (
        <Motif key={i} i={i} color={primary} />
      ))}

      {/* Background glowing lights */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[850px] h-[550px] rounded-full blur-[190px]" style={{ background: `${primary}15` }} />
        <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[650px] h-[450px] rounded-full blur-[160px]" style={{ background: `${secondary}12` }} />
      </div>

      {/* Floating Audio Controller */}
      <InviteAudioPlayer playing={playing} reducedMotion={reducedMotion} onToggle={toggleMusic} />

      {/* Hero Section */}
      <InviteHero event={event} guestParam={guestParam} reducedMotion={reducedMotion} />

      {/* Cover Image Section */}
      <InviteCoverImage coverImage={event.coverImage} title={event.title} />

      {/* Countdown Section */}
      <Section className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <SectionTitle>العد التنازلي للموعد</SectionTitle>
          <p className="text-slate-600 text-sm font-bold font-normal-text">المتبقي على حلول لحظتنا السعيدة</p>
          <div className="pt-2">
            <CountdownTimer targetDate={event.dateTime} primaryColor={primary} />
          </div>
        </div>
      </Section>

      {/* Date & Time Section */}
      <InviteDateTime event={event} />

      {/* Location Section */}
      <InviteLocation event={event} />

      {/* RSVP Section */}
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

      {/* Digital Pass & QR Code Section */}
      <InviteDigitalPass eventTitle={event.title} inviteUrl={inviteUrl} />

      {/* Footer */}
      <InviteFooter eventId={event.id} />
    </main>
  );
}