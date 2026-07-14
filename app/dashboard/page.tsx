'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, LogOut, Eye, Trash2, ExternalLink,
  Calendar, Users, TrendingUp, Heart, ChevronRight,
  Music, MapPin, Clock,
} from 'lucide-react';
import { useAppContext } from '@/lib/context/app-context';
import { ProtectedRoute } from '@/components/protected-route';
import { getTrackById } from '@/lib/music-tracks';

const formatDate = (date: Date) =>
  new Date(date).toLocaleDateString('ar-EG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const eventTypeConfig: Record<string, { label: string; gradient: string; badgeBg: string; badgeText: string }> = {
  Wedding:     { label: '💍 زفاف',    gradient: 'from-rose-500 to-pink-600',    badgeBg: 'bg-rose-500/15',    badgeText: 'text-rose-400' },
  Engagement:  { label: '💜 خطوبة',   gradient: 'from-purple-500 to-violet-600', badgeBg: 'bg-purple-500/15',  badgeText: 'text-purple-400' },
  'Katb Ketab':{ label: '📜 كتب كتاب', gradient: 'from-amber-400 to-orange-500', badgeBg: 'bg-amber-500/15',   badgeText: 'text-amber-400' },
};

export default function DashboardPage() {
  const router = useRouter();
  const { events, deleteEvent, logout } = useAppContext();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleLogout = () => { logout(); router.push('/'); };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الحدث؟')) {
      setDeletingId(id);
      setTimeout(() => { deleteEvent(id); setDeletingId(null); }, 350);
    }
  };

  const totalRSVPs  = events.reduce((s, e) => s + e.guests.length, 0);
  const totalViews  = events.reduce((s, e) => s + e.views, 0);

  const stats = [
    { label: 'إجمالي الأحداث',   value: events.length, icon: Calendar,    gradient: 'from-rose-400 to-pink-600',    bg: 'bg-rose-500/10',   glow: 'shadow-rose-500/20' },
    { label: 'الحضور المؤكد',     value: totalRSVPs,    icon: Users,       gradient: 'from-violet-400 to-purple-600', bg: 'bg-violet-500/10', glow: 'shadow-violet-500/20' },
    { label: 'إجمالي المشاهدات', value: totalViews,    icon: TrendingUp,  gradient: 'from-amber-400 to-orange-500',  bg: 'bg-amber-500/10',  glow: 'shadow-amber-500/20' },
  ];

  return (
    <ProtectedRoute>
      <main className="luxury-bg">
        {/* Ambient background blobs */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-rose-500/4 blur-[140px]" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-500/4 blur-[140px]" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-amber-400/2 blur-[100px]" />
        </div>

        {/* ── Navbar ── */}
        <nav className="sticky top-0 z-50 luxury-glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <p className="text-base font-bold text-white leading-none tracking-tight">Weddingly</p>
                <p className="text-[10px] text-white/30 leading-none mt-0.5">لوحة التحكم</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link href="/dashboard/create">
                <button className="luxury-btn-primary flex items-center gap-2 text-sm">
                  <Plus className="w-4 h-4" />
                  حدث جديد
                </button>
              </Link>
              <button onClick={handleLogout} className="luxury-btn-ghost flex items-center gap-2 text-sm">
                <LogOut className="w-4 h-4" />
                خروج
              </button>
            </div>
          </div>
        </nav>

        {/* ── Content ── */}
        <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-3xl font-bold text-white mb-1">أحداثك ✨</h2>
            <p className="text-white/40 text-sm">إدارة ومتابعة جميع دعوات أحداثك بكل سهولة</p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="luxury-card p-6 group"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className={`p-2.5 rounded-xl ${s.bg} shadow-lg ${s.glow}`}>
                    <s.icon className={`w-5 h-5 text-transparent bg-gradient-to-br ${s.gradient} [background-clip:text] [-webkit-background-clip:text]`} />
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/40 transition-colors" />
                </div>
                <p className={`text-4xl font-bold text-transparent bg-gradient-to-r ${s.gradient} bg-clip-text mb-1.5`}>{s.value}</p>
                <p className="text-white/40 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Section title */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white/80">قائمة الأحداث</h3>
            <span className="text-xs text-white/30 bg-white/5 border border-white/8 rounded-full px-3 py-1">{events.length} حدث</span>
          </div>

          {/* Events Grid */}
          {events.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="luxury-card p-16 text-center"
            >
              <div className="text-6xl mb-4 animate-bounce-sm">💌</div>
              <h3 className="text-xl font-bold text-white mb-2">لا يوجد أحداث بعد</h3>
              <p className="text-white/40 text-sm mb-8">أنشئ أول حدث لك وابدأ في إرسال الدعوات الجميلة</p>
              <Link href="/dashboard/create">
                <button className="luxury-btn-primary inline-flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  أنشئ حدثك الأول
                </button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence>
                {events.map((event, idx) => {
                  const typeConf = eventTypeConfig[event.type] ?? eventTypeConfig['Wedding'];
                  const track    = getTrackById(event.musicTrack);
                  const isDeleting = deletingId === event.id;

                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 22 }}
                      animate={isDeleting ? { opacity: 0, scale: 0.9 } : { opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      className="luxury-card overflow-hidden group flex flex-col"
                    >
                      {/* Cover image / gradient */}
                      <div className="relative h-44 overflow-hidden flex-shrink-0">
                        {event.coverImage ? (
                          <img
                            src={event.coverImage}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${typeConf.gradient} opacity-25 flex items-center justify-center`}>
                            <Heart className="w-14 h-14 text-white/20" />
                          </div>
                        )}
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-[#060a14]/40 to-transparent" />

                        {/* Type badge */}
                        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold ${typeConf.badgeBg} ${typeConf.badgeText} backdrop-blur-md border border-white/10`}>
                          {typeConf.label}
                        </span>

                        {/* Views */}
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/40 backdrop-blur-sm border border-white/10">
                          <Eye className="w-3 h-3 text-white/50" />
                          <span className="text-[11px] text-white/50">{event.views}</span>
                        </div>

                        {/* Music badge at bottom */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
                          <span className="text-[11px]">{track.emoji}</span>
                          <span className="text-[11px] text-white/60 truncate max-w-[100px]">{track.nameAr}</span>
                        </div>
                      </div>

                      {/* Body */}
                      <div className="p-5 flex flex-col gap-4 flex-1">
                        <div>
                          <h3 className="font-bold text-white text-sm leading-snug mb-2 line-clamp-1">{event.title}</h3>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-white/40 text-xs">
                              <Users className="w-3 h-3" />
                              <span>{event.hostName}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/40 text-xs">
                              <Clock className="w-3 h-3" />
                              <span>{formatDate(event.dateTime)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/40 text-xs">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          </div>
                        </div>

                        {/* Mini stats */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-violet-500/10 border border-violet-500/10 p-2.5 text-center">
                            <p className="text-xs text-white/35 mb-0.5">الحضور</p>
                            <p className="text-lg font-bold text-violet-400">{event.guests.length}</p>
                          </div>
                          <div className="rounded-lg bg-amber-500/10 border border-amber-500/10 p-2.5 text-center">
                            <p className="text-xs text-white/35 mb-0.5">مشاهدات</p>
                            <p className="text-lg font-bold text-amber-400">{event.views}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-auto">
                          <Link href={`/dashboard/events/${event.id}`} className="flex-1">
                            <button className="luxury-btn-ghost w-full text-xs py-2 px-3 text-center">
                              التفاصيل
                            </button>
                          </Link>
                          <Link href={`/invite/${event.slug}`} target="_blank" className="flex-1">
                            <button className="luxury-btn-ghost w-full text-xs py-2 px-3 flex items-center justify-center gap-1">
                              <ExternalLink className="w-3 h-3" />
                              معاينة
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="py-2 px-3 rounded-xl bg-red-500/10 border border-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/20 transition-all duration-200"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
