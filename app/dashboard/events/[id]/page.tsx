'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Heart, ArrowLeft, Copy, Check, Eye, Users, TrendingUp,
  Calendar, MapPin, Edit3, Trash2, ExternalLink, QrCode, Clock, Share2
} from 'lucide-react';
import { useAppContext } from '@/lib/context/app-context';
import { getOptimizedImageUrl } from '@/lib/utils';
import QRCode from 'react-qr-code';

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getEvent, deleteEvent, isEventAuthorized, loginWithEventPasscode } = useAppContext();
  const id = params.id as string;
  const event = getEvent(id);
  const [copied, setCopied] = useState(false);
  const [inputPasscode, setInputPasscode] = useState('');
  const [passError, setPassError] = useState('');

  if (!event) {
    return (
      <ProtectedRoute>
        <main className="luxury-bg min-h-screen flex items-center justify-center p-6">
          <div className="luxury-card p-10 text-center max-w-md w-full space-y-4">
            <div className="text-5xl mb-2">🔍</div>
            <h2 className="text-2xl font-bold text-white">الحدث غير موجود</h2>
            <p className="text-white/40 text-sm">عذراً، قد يكون تم حذف هذا الحدث أو أن الرابط غير صحيح.</p>
            <Link href="/dashboard" className="inline-block pt-2">
              <button className="luxury-btn-primary">
                العودة للوحة التحكم
              </button>
            </Link>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  // Check authorization for this specific event
  if (!isEventAuthorized(event.id)) {
    const handlePasscodeSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setPassError('');
      const res = loginWithEventPasscode(inputPasscode);
      if (!res.success) {
        setPassError(res.error || 'رمز غير صحيح');
      }
    };

    return (
      <ProtectedRoute>
        <main className="luxury-bg min-h-screen flex items-center justify-center p-6">
          <div className="luxury-card p-8 text-center max-w-md w-full space-y-6">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center shadow-xl">
              <span className="text-2xl">🔐</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">دخول إدارة الدعوة</h2>
              <p className="text-white/40 text-xs mt-1">
                من فضلك أدخل كلمة سر الدعوة (🔑) للدخول لمتابعة الضيوف وإدارتها
              </p>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <input
                type="password"
                value={inputPasscode}
                onChange={(e) => setInputPasscode(e.target.value)}
                placeholder="أدخل كلمة سر الدعوة (مثال: 1234)"
                className="luxury-input w-full px-4 py-3 text-center text-sm font-mono"
                autoFocus
              />
              {passError && <p className="text-red-400 text-xs font-bold">{passError}</p>}
              <button type="submit" className="luxury-btn-primary w-full py-3">
                فتح الدعوة ✨
              </button>
            </form>

            <Link href="/dashboard" className="inline-block text-white/30 text-xs hover:text-white/60">
              ← العودة للوحة التحكم
            </Link>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  const handleDelete = () => {
    if (confirm('هل أنت متأكد من حذف هذا الحدث؟ لا يمكن التراجع عن هذا الإجراء.')) {
      deleteEvent(event.id);
      router.push('/dashboard');
    }
  };

  const invitationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/invite/${event.slug}`
    : `/invite/${event.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(invitationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ar-EG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalAttendees = event.guests.reduce((sum, guest) => sum + guest.numAttendees, 0);
  const conversionRate = event.views > 0 ? ((event.guests.length / event.views) * 100).toFixed(1) : '0';

  return (
    <ProtectedRoute>
      <main className="luxury-bg min-h-screen">
        {/* Ambient blobs */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-rose-500/5 blur-[140px]" />
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[140px]" />
        </div>

        {/* ── Navbar ── */}
        <nav className="sticky top-0 z-50 luxury-glass border-b border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <div>
                <p className="text-base font-bold text-white leading-none">تفاصيل الحدث 📊</p>
                <p className="text-[10px] text-white/30 leading-none mt-0.5">{event.title}</p>
              </div>
            </div>

            <Link href="/dashboard">
              <button className="luxury-btn-ghost flex items-center gap-2 text-sm">
                <ArrowLeft className="w-4 h-4" />
                لوحة التحكم
              </button>
            </Link>
          </div>
        </nav>

        {/* ── Main Content ── */}
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="luxury-card p-8 relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-400 border border-rose-500/20">
                    {event.type === 'Wedding' ? '💍 زفاف' : event.type === 'Engagement' ? '💜 خطوبة' : '📜 كتب كتاب'}
                  </span>
                  {event.passcode && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/25 flex items-center gap-1 font-mono">
                      🔑 رمز الدخول: {event.passcode}
                    </span>
                  )}
                  <span className="text-xs text-white/40 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    تاريخ الحدث
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-white leading-tight">{event.title}</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2.5 text-white/70 text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                    <Users className="w-4 h-4 text-rose-400" />
                    <span>المضيف: <strong className="text-white">{event.hostName}</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white/70 text-sm bg-white/5 p-3 rounded-xl border border-white/5">
                    <Calendar className="w-4 h-4 text-violet-400" />
                    <span>{formatDate(event.dateTime)}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-white/70 text-sm bg-white/5 p-3 rounded-xl border border-white/5 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>

                {event.message && (
                  <div className="p-4 rounded-xl bg-white/5 border border-white/8 text-white/80 text-sm italic">
                    &ldquo;{event.message}&rdquo;
                  </div>
                )}
              </div>

              {/* Cover image / Actions */}
              <div className="space-y-4">
                {event.coverImage ? (
                  <div className="rounded-xl overflow-hidden border border-white/10 h-48 relative">
                    <img
                      src={getOptimizedImageUrl(event.coverImage, 600)}
                      alt={event.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="rounded-xl border border-white/10 h-48 bg-gradient-to-br from-rose-500/20 to-violet-600/20 flex items-center justify-center">
                    <Heart className="w-16 h-16 text-white/20" />
                  </div>
                )}

                <div className="flex gap-2">
                  <Link href={`/dashboard/create?edit=${event.id}`} className="flex-1">
                    <button className="luxury-btn-ghost w-full flex items-center justify-center gap-1.5 text-sm text-amber-300 border-amber-500/20 hover:bg-amber-500/10">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      تعديل
                    </button>
                  </Link>
                  <Link href={`/invite/${event.slug}`} target="_blank" className="flex-1">
                    <button className="luxury-btn-ghost w-full flex items-center justify-center gap-1.5 text-sm">
                      <ExternalLink className="w-4 h-4" />
                      معاينة
                    </button>
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
                    title="حذف الحدث"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="luxury-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-violet-500/10">
                  <Eye className="w-5 h-5 text-violet-400" />
                </div>
                <span className="text-xs text-white/30">المشاهدات</span>
              </div>
              <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text mb-1">
                {event.views}
              </p>
              <p className="text-white/40 text-xs">إجمالي زيارات صفحة الدعوة</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="luxury-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-xs text-white/30">تأكيدات الحضور</span>
              </div>
              <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text mb-1">
                {event.guests.length}
              </p>
              <p className="text-white/40 text-xs">إجمالي الضيوف المؤكدين ({totalAttendees} أفراد)</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="luxury-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-xs text-white/30">نسبة التفاعل</span>
              </div>
              <p className="text-4xl font-bold text-transparent bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text mb-1">
                {conversionRate}%
              </p>
              <p className="text-white/40 text-xs">من زوار الصفحة قَبلوا الدعوة</p>
            </motion.div>
          </div>

          {/* Share & QR Code */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="luxury-card p-6 lg:col-span-2 space-y-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-rose-500/10">
                  <Share2 className="w-4 h-4 text-rose-400" />
                </div>
                <h3 className="text-white font-semibold">رابط مشاركة الدعوة</h3>
              </div>

              <p className="text-white/40 text-xs">
                شارك هذا الرابط مع ضيوفك على الواتساب أو منصات التواصل الاجتماعي لفتح الدعوة
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={invitationUrl}
                  readOnly
                  className="luxury-input flex-1 px-4 py-3 text-sm dir-ltr"
                />
                <button
                  onClick={handleCopyLink}
                  className="luxury-btn-primary flex items-center justify-center gap-2 whitespace-nowrap px-6"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      تم النسخ!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      نسخ الرابط
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link href={`/invite/${event.slug}`} target="_blank" className="w-full">
                  <button className="luxury-btn-ghost w-full flex items-center justify-center gap-2 text-sm">
                    <ExternalLink className="w-4 h-4" />
                    معاينة صفحة الدعوة مباشرة
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="luxury-card p-6 flex flex-col items-center justify-center text-center space-y-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <QrCode className="w-4 h-4 text-amber-400" />
                <h3 className="text-white font-semibold text-sm">رمز QR للدعوة</h3>
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-xl">
                <QRCode value={invitationUrl} size={150} />
              </div>
              <p className="text-white/35 text-xs">امسح الكود بالكاميرا لفتح الدعوة</p>
            </motion.div>
          </div>

          {/* Guest List */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="luxury-card p-6 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-violet-500/10">
                  <Users className="w-4 h-4 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold">قائمة الضيوف المؤكدين</h3>
              </div>
              <span className="text-xs text-white/30 bg-white/5 border border-white/8 rounded-full px-3 py-1">
                {event.guests.length} ردود
              </span>
            </div>

            {event.guests.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="text-4xl">💌</div>
                <p className="text-white font-semibold text-base">لا يوجد تأكيدات حضور بعد</p>
                <p className="text-white/35 text-xs max-w-sm mx-auto">
                  قم بمشاركة رابط الدعوة مع الأقارب والأصدقاء لتبدأ في الاستجابة وتأكيد الحضور
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-white/40 text-xs">
                      <th className="py-3 px-4">اسم الضيف</th>
                      <th className="py-3 px-4">عدد الأفراد</th>
                      <th className="py-3 px-4">تاريخ التأكيد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {event.guests.map((guest) => (
                      <tr key={guest.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">{guest.name}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-violet-500/15 text-violet-300 border border-violet-500/20">
                            {guest.numAttendees} {guest.numAttendees === 1 ? 'فرد' : 'أفراد'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-white/40 text-xs">
                          {new Date(guest.timestamp).toLocaleDateString('ar-EG', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

        </div>
      </main>
    </ProtectedRoute>
  );
}
