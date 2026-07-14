'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft, Palette, Music, Play, Pause, Check } from 'lucide-react';
import { ProtectedRoute } from '@/components/protected-route';
import { EventForm } from '@/components/event-form';
import { MUSIC_TRACKS, MusicTrack } from '@/lib/music-tracks';

const THEMES = [
  { name: 'Romantic',  nameAr: 'رومانسي',  primary: '#e8627a', secondary: '#f43f5e', gradient: 'from-rose-500 to-pink-600' },
  { name: 'Luxury',    nameAr: 'فاخر',      primary: '#111827', secondary: '#7c3aed', gradient: 'from-gray-900 to-violet-700' },
  { name: 'Ocean',     nameAr: 'أوشن',      primary: '#0ea5e9', secondary: '#22c55e', gradient: 'from-sky-500 to-emerald-500' },
  { name: 'Sunset',    nameAr: 'غروب',      primary: '#f97316', secondary: '#ec4899', gradient: 'from-orange-500 to-pink-500' },
  { name: 'Royal',     nameAr: 'ملكي',      primary: '#d4a853', secondary: '#7c3aed', gradient: 'from-amber-400 to-violet-600' },
  { name: 'Emerald',   nameAr: 'زمردي',     primary: '#10b981', secondary: '#059669', gradient: 'from-emerald-500 to-teal-600' },
];

export default function CreateEventPage() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme]  = useState(THEMES[0]);
  const [selectedTrack, setSelectedTrack]  = useState<MusicTrack>(MUSIC_TRACKS[1]); // Arabic Vibes default
  const [playingId, setPlayingId]          = useState<string | null>(null);
  const audioRef                           = useRef<HTMLAudioElement | null>(null);

  const togglePreview = (track: MusicTrack) => {
    if (!audioRef.current) audioRef.current = new Audio();

    if (playingId === track.id) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      audioRef.current.src  = track.url;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
      setPlayingId(track.id);
    }
  };

  const handleSelectTrack = (track: MusicTrack) => {
    setSelectedTrack(track);
  };

  const handleSubmit = () => {
    audioRef.current?.pause();
    router.push('/dashboard');
  };

  return (
    <ProtectedRoute>
      <main className="luxury-bg">
        {/* Ambient blobs */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-rose-500/5 blur-[130px]" />
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[120px]" />
        </div>

        {/* Navbar */}
        <nav className="sticky top-0 z-50 luxury-glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <p className="text-base font-bold text-white leading-none tracking-tight">إنشاء حدث جديد ✨</p>
                <p className="text-[10px] text-white/30 leading-none mt-0.5">اختر الثيم والموسيقى وأنشئ دعوتك</p>
              </div>
            </div>
            <Link href="/dashboard">
              <button className="luxury-btn-ghost flex items-center gap-2 text-sm">
                <ArrowLeft className="w-4 h-4" />
                رجوع
              </button>
            </Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Selectors + Form */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── Theme Selector ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="luxury-card p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 rounded-lg bg-rose-500/10">
                  <Palette className="w-4 h-4 text-rose-400" />
                </div>
                <h2 className="text-white font-semibold">اختر ثيم الدعوة</h2>
              </div>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => setSelectedTheme(theme)}
                    className="group relative flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200"
                    style={{
                      borderColor: selectedTheme.name === theme.name ? theme.primary : 'rgba(255,255,255,0.07)',
                      background:  selectedTheme.name === theme.name ? `${theme.primary}18` : 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div
                      className="w-full h-8 rounded-lg shadow-md"
                      style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                    />
                    <span className="text-xs text-white/60 group-hover:text-white/80 transition-colors">{theme.nameAr}</span>
                    {selectedTheme.name === theme.name && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                        <Check className="w-3 h-3 text-gray-900" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ── Music Selector ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="luxury-card p-6"
            >
              <div className="flex items-center gap-2 mb-5">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Music className="w-4 h-4 text-violet-400" />
                </div>
                <h2 className="text-white font-semibold">اختر موسيقى الدعوة</h2>
                <span className="text-xs text-white/30 mr-auto bg-white/5 border border-white/8 rounded-full px-2.5 py-0.5">
                  {selectedTrack.nameAr}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {MUSIC_TRACKS.map((track) => {
                  const isSelected = selectedTrack.id === track.id;
                  const isPlaying  = playingId === track.id;

                  return (
                    <div
                      key={track.id}
                      onClick={() => handleSelectTrack(track)}
                      className="relative rounded-xl border p-4 cursor-pointer transition-all duration-200 group"
                      style={{
                        borderColor: isSelected ? track.gradientFrom : 'rgba(255,255,255,0.07)',
                        background:  isSelected ? `${track.gradientFrom}18` : 'rgba(255,255,255,0.02)',
                      }}
                    >
                      {/* Emoji + Info */}
                      <div className="flex items-start gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 shadow-md"
                          style={{ background: `linear-gradient(135deg, ${track.gradientFrom}40, ${track.gradientTo}40)`, border: `1px solid ${track.gradientFrom}30` }}
                        >
                          <span className={isPlaying ? 'music-playing-ring inline-block' : ''}>{track.emoji}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium leading-none mb-1 truncate">{track.nameAr}</p>
                          <p className="text-white/35 text-xs">{track.genre}</p>
                        </div>
                      </div>

                      {/* Play button */}
                      <button
                        onClick={(e) => { e.stopPropagation(); togglePreview(track); }}
                        className="mt-3 w-full py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all duration-200"
                        style={{
                          background: isPlaying ? `${track.gradientFrom}30` : 'rgba(255,255,255,0.05)',
                          color:      isPlaying ? track.gradientFrom : 'rgba(255,255,255,0.5)',
                          border:     `1px solid ${isPlaying ? track.gradientFrom + '40' : 'rgba(255,255,255,0.08)'}`,
                        }}
                      >
                        {isPlaying ? <><Pause className="w-3 h-3" /> إيقاف</> : <><Play className="w-3 h-3" /> تجربة</>}
                      </button>

                      {/* Selected checkmark */}
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
                          <Check className="w-3 h-3 text-gray-900" strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* ── Event Form ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <EventForm
                onSubmit={handleSubmit}
                defaultValues={{
                  theme:      { primary: selectedTheme.primary, secondary: selectedTheme.secondary, name: selectedTheme.name },
                  musicTrack: selectedTrack.id,
                }}
              />
            </motion.div>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="sticky top-24"
            >
              <div className="luxury-card overflow-hidden">
                <div className="p-4 border-b border-white/5">
                  <p className="text-white/60 text-sm font-medium text-center">معاينة مباشرة 👀</p>
                </div>

                {/* Preview */}
                <div
                  className="h-[500px] flex flex-col items-center justify-center text-white text-center p-8 transition-all duration-700 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${selectedTheme.primary}, ${selectedTheme.secondary})` }}
                >
                  {/* Decorative circles */}
                  <div className="absolute top-[-30%] left-[-30%] w-60 h-60 rounded-full bg-white/5" />
                  <div className="absolute bottom-[-20%] right-[-20%] w-48 h-48 rounded-full bg-white/5" />

                  <motion.div
                    key={selectedTheme.name}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 space-y-4"
                  >
                    <div className="text-4xl">{selectedTrack.emoji}</div>
                    <p className="text-white/70 text-sm">دعوة حضور</p>
                    <h1 className="text-2xl font-bold">عنوان الحدث</h1>
                    <div className="w-16 h-0.5 bg-white/40 mx-auto rounded-full" />
                    <p className="text-white/70 text-sm">من تنظيم: مضيف الحدث</p>
                    <div className="mt-4 px-5 py-2 border border-white/40 rounded-full text-sm">
                      🎵 {selectedTrack.nameAr}
                    </div>
                  </motion.div>
                </div>

                {/* Theme + Music info */}
                <div className="p-4 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md shadow" style={{ background: `linear-gradient(135deg, ${selectedTheme.primary}, ${selectedTheme.secondary})` }} />
                    <span className="text-white/40 text-xs">{selectedTheme.nameAr}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/40 text-xs">
                    <span>{selectedTrack.emoji}</span>
                    <span>{selectedTrack.nameAr}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}