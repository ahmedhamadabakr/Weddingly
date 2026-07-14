'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/lib/context/app-context';
import { Heart, Sparkles, BarChart3, Share2, ChevronRight, Music, X, MessageCircle, Facebook, Instagram } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'دعوات إبداعية',
    desc: 'تصميمات عصرية وأنيقة لحفلات الزفاف والخطوبة وكتب الكتاب.',
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Music,
    title: 'موسيقى مخصصة',
    desc: 'اختر من مكتبة موسيقية متنوعة تُشغَّل تلقائياً عند فتح الدعوة.',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/10',
  },
  {
    icon: BarChart3,
    title: 'تتبع الحضور',
    desc: 'راقب ردود الفعل وتأكيدات الحضور في الوقت الفعلي من لوحة التحكم.',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Share2,
    title: 'روابط قابلة للمشاركة',
    desc: 'رابط فريد وكود QR لكل دعوة، سهل المشاركة عبر أي منصة.',
    gradient: 'from-teal-400 to-cyan-500',
    bg: 'bg-teal-500/10',
  },
];

// ── Social contact links (edit these to your real accounts) ──
const SOCIAL_LINKS = {
  whatsapp:  'https://wa.me/201000000000',     // ← غير الرقم
  facebook:  'https://facebook.com/weddingly', // ← غير الرابط
  instagram: 'https://instagram.com/weddingly',// ← غير الرابط
};

export default function HomePage() {
  const { currentUser } = useAppContext();
  const [showSocial, setShowSocial] = useState(false);

  return (
    <main className="luxury-bg min-h-screen overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-rose-500/5 blur-[150px]" />
        <div className="absolute top-[60%] -right-48 w-[600px] h-[600px] rounded-full bg-violet-500/5 blur-[130px]" />
        <div className="absolute top-[40%] -left-32 w-[400px] h-[400px] rounded-full bg-amber-400/3 blur-[100px]" />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 luxury-glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-white font-bold tracking-tight">Weddingly</span>
          </div>

          {currentUser.isAuthenticated ? (
            <Link href="/dashboard">
              <button className="luxury-btn-primary flex items-center gap-1.5 text-sm">
                لوحة التحكم
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          ) : (
            <Link href="/login">
              <button className="luxury-btn-ghost text-sm">دخول الإدارة</button>
            </Link>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-3xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            دعوات رقمية فاخرة
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="text-white">اصنع دعوتك</span>
            <br />
            <span className="gradient-text-animated">بلمسة فنية</span>
          </h1>

          <p className="text-white/40 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
            صمّم دعوات زفاف وخطوبة رقمية مذهلة، شارك روابطها، وتابع تأكيدات الحضور في لحظتها.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser.isAuthenticated ? (
              <>
                <Link href="/dashboard/create">
                  <button className="luxury-btn-primary flex items-center gap-2 text-base px-8 py-3.5">
                    <Sparkles className="w-4 h-4" />
                    أنشئ دعوتك الآن
                  </button>
                </Link>
                <Link href="/dashboard">
                  <button className="luxury-btn-ghost flex items-center gap-2 text-base px-8 py-3.5">
                    عرض الأحداث
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Link>
              </>
            ) : (
              <>
                {/* ── ابدأ مجاناً → يفتح شبكات التواصل ── */}
                <button
                  onClick={() => setShowSocial(true)}
                  className="luxury-btn-primary flex items-center gap-2 text-base px-8 py-3.5"
                >
                  <Sparkles className="w-4 h-4" />
                  ابدأ مجاناً
                </button>

              </>
            )}
          </div>

          {/* Floating preview cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="grid grid-cols-3 gap-3 max-w-sm mx-auto mt-6"
          >
            {[
              { emoji: '💍', label: 'زفاف', gradient: 'from-rose-500 to-pink-600' },
              { emoji: '💜', label: 'خطوبة', gradient: 'from-violet-500 to-purple-600' },
              { emoji: '📜', label: 'كتب كتاب', gradient: 'from-amber-400 to-orange-500' },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-xl p-3 bg-gradient-to-br ${item.gradient} bg-opacity-10 border border-white/8 text-center`}
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="text-2xl mb-1">{item.emoji}</div>
                <p className="text-white/50 text-xs">{item.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">كل ما تحتاجه في مكان واحد</h2>
          <p className="text-white/35 text-base">من التصميم حتى الضيوف — كل شيء بنقرة واحدة</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="luxury-card p-6 group"
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className={`w-5 h-5 text-transparent bg-gradient-to-br ${f.gradient} [background-clip:text] [-webkit-background-clip:text]`} />
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-white/35 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden p-12 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(232,98,122,0.12) 0%, rgba(168,85,247,0.12) 100%)',
            border: '1px solid rgba(232,98,122,0.15)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-violet-500/5 pointer-events-none" />
          <div className="relative z-10 space-y-5">
            <h2 className="text-3xl font-bold text-white">جاهز لإنشاء دعوتك؟</h2>
            <p className="text-white/40 text-base">انضم لآلاف الأزواج الذين شاركوا لحظاتهم بأسلوب فاخر</p>
            {currentUser.isAuthenticated ? (
              <Link href="/dashboard/create">
                <button className="luxury-btn-primary inline-flex items-center gap-2 text-base px-10 py-3.5">
                  <Heart className="w-4 h-4 fill-white" />
                  ابدأ الآن مجاناً
                </button>
              </Link>
            ) : (
              <button
                onClick={() => setShowSocial(true)}
                className="luxury-btn-primary inline-flex items-center gap-2 text-base px-10 py-3.5"
              >
                <Heart className="w-4 h-4 fill-white" />
                ابدأ الآن مجاناً
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6">
        <p className="text-center text-white/20 text-sm">
          Weddingly © {new Date().getFullYear()} — صُنع بـ ❤️ لأجمل اللحظات
        </p>
      </footer>

      {/* ══ Social Contact Modal ══ */}
      <AnimatePresence>
        {showSocial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowSocial(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-2xl p-8 relative"
                style={{
                  background: 'linear-gradient(160deg, #0d1220 0%, #0a0e1a 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                }}
              >
                {/* Close */}
                <button
                  onClick={() => setShowSocial(false)}
                  className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white/50" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-xl shadow-rose-500/25">
                    <Heart className="w-7 h-7 text-white fill-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">تواصل معنا</h3>
                  <p className="text-white/35 text-sm">اختر طريقة التواصل المفضلة لديك</p>
                </div>

                {/* Social Buttons */}
                <div className="space-y-3">

                  {/* WhatsApp */}
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 group"
                    style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(37,211,102,0.15)' }}>
                      <MessageCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-white font-semibold text-sm">واتساب</p>
                      <p className="text-emerald-400/60 text-xs">تواصل فوري</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors rotate-180" />
                  </a>

                  {/* Facebook */}
                  <a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 group"
                    style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(59,130,246,0.15)' }}>
                      <Facebook className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-white font-semibold text-sm">فيسبوك</p>
                      <p className="text-blue-400/60 text-xs">صفحتنا الرسمية</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors rotate-180" />
                  </a>

                  {/* Instagram */}
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 group"
                    style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(168,85,247,0.15)' }}>
                      <Instagram className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-white font-semibold text-sm">إنستاغرام</p>
                      <p className="text-violet-400/60 text-xs">شاهد أعمالنا</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors rotate-180" />
                  </a>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
