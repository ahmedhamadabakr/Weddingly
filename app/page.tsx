'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '@/lib/context/app-context';
import {
  Heart, Sparkles, BarChart3, Share2, ChevronRight, Music, X,
  MessageCircle, Facebook, Instagram, Crown, BookOpen, Lock, KeyRound,
  MapPin, CheckCircle2, QrCode, ShieldCheck, ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'دعوات رقمية مبهرة',
    desc: 'تصميمات عصرية فاخرة لحفلات الزفاف والخطوبة وكتب الكتاب تليق بليلة العمر.',
    iconColor: 'text-rose-400',
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-500/15',
    border: 'border-rose-500/30',
    glow: 'shadow-rose-500/20',
  },
  {
    icon: Music,
    title: 'موسيقى مخصصة',
    desc: 'اختر المقطع الموسيقي المفضل لك أو ارفع مقطعك الخاص ليُشغَّل تلقائياً عند الفتح.',
    iconColor: 'text-violet-400',
    gradient: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-500/15',
    border: 'border-violet-500/30',
    glow: 'shadow-violet-500/20',
  },
  {
    icon: BarChart3,
    title: 'تتبع الحضور والمؤكدين',
    desc: 'احصل على إحصائيات دقيقة وإشعارات فورية لردود الضيوف وعدد المرافقين.',
    iconColor: 'text-amber-400',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    glow: 'shadow-amber-500/20',
  },
  {
    icon: KeyRound,
    title: 'كلمة سر خاصة لكل دعوة',
    desc: 'نظام أمان مستقل يتيح لكل عريس وعروسة الدخول لدعوتهم ومتابعة ضيوفهم بكلمة سر خاصة.',
    iconColor: 'text-emerald-400',
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    glow: 'shadow-emerald-500/20',
  },
  {
    icon: MapPin,
    title: 'خرائط جوجل وموقع الحفل',
    desc: 'ربط مباشر بموقع الحفل على خرائط جوجل لسهولة وصول الضيوف بدون عناء.',
    iconColor: 'text-sky-400',
    gradient: 'from-sky-400 to-blue-500',
    bg: 'bg-sky-500/15',
    border: 'border-sky-500/30',
    glow: 'shadow-sky-500/20',
  },
  {
    icon: QrCode,
    title: 'رمز QR وروابط سريعة',
    desc: 'رمز QR خاص ودقيق لكل دعوة يسهل طباعته أو مشاركته عبر الواتساب والتواصل الاجتماعي.',
    iconColor: 'text-pink-400',
    gradient: 'from-pink-400 to-rose-500',
    bg: 'bg-pink-500/15',
    border: 'border-pink-500/30',
    glow: 'shadow-pink-500/20',
  },
];

const eventCategories = [
  {
    icon: Crown,
    label: 'حفلات الزفاف',
    desc: 'دعوات فاخرة بأسلوب ملكي',
    gradient: 'from-rose-500 via-pink-500 to-rose-600',
    bg: 'bg-rose-500/15',
    color: 'text-rose-400',
  },
  {
    icon: Heart,
    label: 'حفلات الخطوبة',
    desc: 'لمسات رومانسية عصرية',
    gradient: 'from-violet-500 via-purple-500 to-violet-600',
    bg: 'bg-violet-500/15',
    color: 'text-violet-400',
  },
  {
    icon: BookOpen,
    label: 'كتب الكتاب',
    desc: 'طابع إسلامي وعربي أصيل',
    gradient: 'from-amber-400 via-orange-500 to-amber-600',
    bg: 'bg-amber-500/15',
    color: 'text-amber-400',
  },
];

// ── Social contact links ──
const SOCIAL_LINKS = {
  whatsapp:  'https://wa.me/201000000000',
  facebook:  'https://facebook.com/weddingly',
  instagram: 'https://instagram.com/weddingly',
};

export default function HomePage() {
  const { currentUser } = useAppContext();
  const [showSocial, setShowSocial] = useState(false);

  return (
    <main className="luxury-bg min-h-screen overflow-x-hidden">
      {/* Ambient background blur blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[950px] h-[550px] rounded-full bg-rose-500/6 blur-[160px]" />
        <div className="absolute top-[50%] -right-48 w-[650px] h-[650px] rounded-full bg-violet-500/6 blur-[150px]" />
        <div className="absolute top-[35%] -left-32 w-[450px] h-[450px] rounded-full bg-amber-400/4 blur-[120px]" />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 luxury-glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <span className="text-white font-bold tracking-tight text-lg block leading-none">Weddingly</span>
              <span className="text-[10px] text-white/30 leading-none">دعوات رقمية فاخرة</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser.isAuthenticated ? (
              <Link href="/dashboard">
                <button className="luxury-btn-primary flex items-center gap-2 text-sm">
                  لوحة التحكم
                  <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="luxury-btn-ghost flex items-center gap-1.5 text-sm">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    دخول الدعوات
                  </button>
                </Link>
                <button
                  onClick={() => setShowSocial(true)}
                  className="luxury-btn-primary hidden sm:flex items-center gap-1.5 text-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  اطلب دعوتك
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-4xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold backdrop-blur-md shadow-lg"
          >
            <Crown className="w-4 h-4 text-amber-400" />
            <span>منصة الدعوات الإلكترونية الأولى والحدث الأجمل</span>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight">
            <span className="text-white">اصنع دعوتك الرقمية</span>
            <br />
            <span className="gradient-text-animated">بلمسة فنية فاخرة</span>
          </h1>

          <p className="text-white/50 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            صمّم دعوة زفافك أو خطوبتك بأسلوب ملكي يسحر الضيوف، مع موسيقى مخصصة، تأكيد حضور لحظي، وكلمة سر خاصة لدعوتك.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            {currentUser.isAuthenticated ? (
              <>
                <Link href="/dashboard/create">
                  <button className="luxury-btn-primary flex items-center gap-2 text-base px-8 py-3.5">
                    <Sparkles className="w-5 h-5" />
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
                <button
                  onClick={() => setShowSocial(true)}
                  className="luxury-btn-primary flex items-center gap-2 text-base px-8 py-3.5"
                >
                  <Sparkles className="w-5 h-5" />
                  اطلب دعوتك الآن مجاناً
                </button>
                <Link href="/login">
                  <button className="luxury-btn-ghost flex items-center gap-2 text-base px-8 py-3.5">
                    <KeyRound className="w-4 h-4 text-amber-400" />
                    تسجيل دخول صاحب الدعوة
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Event Types Cards (Using Lucide Icons) */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto pt-6"
          >
            {eventCategories.map((cat) => (
              <div
                key={cat.label}
                className="luxury-card p-5 text-center group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                <div className={`w-12 h-12 mx-auto rounded-2xl ${cat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  <cat.icon className={`w-6 h-6 ${cat.color}`} />
                </div>
                <h3 className="text-white font-bold text-base mb-1">{cat.label}</h3>
                <p className="text-white/40 text-xs">{cat.desc}</p>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-3"
        >
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            مميزات فريدة
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white">كل ما تحتاجه لليلة العمر</h2>
          <p className="text-white/40 text-base max-w-xl mx-auto">
            ميزات متكاملة من التخصيص البصري والموسيقي حتى متابعة الحضور وأمان الدعوة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              viewport={{ once: true }}
              className="luxury-card p-7 group hover:border-white/20 transition-all duration-300 flex flex-col"
            >
              <div className={`w-12 h-12 rounded-2xl ${f.bg} border ${f.border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg ${f.glow}`}>
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed mt-auto">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECURITY & PER-EVENT LOGIN BANNER ── */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="luxury-card p-8 md:p-12 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>خصوصية وأمان تام</span>
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight">
                لكل دعوة نظام دخول مستقل وباسورد خاص بها 🔑
              </h2>
              <p className="text-white/50 text-sm leading-relaxed">
                لا داعي للقلق بشأن تداخل البيانات. يحصل كل عريس وعروسة على كلمة سر خاصة بدعوتهم يتيح لهما الدخول لمتابعة تأكيدات الضيوف وتعديل الحفل في أي وقت بخصوصية كاملة.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <KeyRound className="w-12 h-12 text-amber-400 animate-pulse" />
              <p className="text-white font-bold text-sm">دخول صاحب الدعوة</p>
              <Link href="/login" className="w-full">
                <button className="luxury-btn-primary w-full text-xs py-3 flex items-center justify-center gap-2">
                  <span>أدخل كلمة السر لدعوتك</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden p-10 md:p-16 text-center shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(232,98,122,0.15) 0%, rgba(139,92,246,0.15) 100%)',
            border: '1px solid rgba(232,98,122,0.25)',
          }}
        >
          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-xl shadow-rose-500/30">
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">جاهز لإنشاء دعوتك الفاخرة؟</h2>
            <p className="text-white/50 text-base">
              انضم لآلاف العرسان الذين شاركوا فرحتهم بأجمل تصميم ودعوة رقمية
            </p>

            <div className="pt-2 flex justify-center">
              {currentUser.isAuthenticated ? (
                <Link href="/dashboard/create">
                  <button className="luxury-btn-primary inline-flex items-center gap-2 text-base px-10 py-4 shadow-xl">
                    <Sparkles className="w-5 h-5" />
                    ابدأ الآن مجاناً
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => setShowSocial(true)}
                  className="luxury-btn-primary inline-flex items-center gap-2 text-base px-10 py-4 shadow-xl"
                >
                  <Sparkles className="w-5 h-5" />
                  اطلب دعوتك مجاناً
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center space-y-2">
        <p className="text-white/40 text-sm font-semibold">Weddingly — صُنع بـ ❤️ لأجمل اللحظات</p>
        <p className="text-white/30 text-xs">
          جميع الحقوق محفوظة لـ{' '}
          <a
            href="https://www.connectxsolutions.online/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-400 hover:underline font-semibold"
          >
            ConnectX Solutions
          </a>{' '}
          © {new Date().getFullYear()}
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
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
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
                className="rounded-3xl p-8 relative"
                style={{
                  background: 'linear-gradient(160deg, #0d1220 0%, #0a0e1a 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
                }}
              >
                {/* Close */}
                <button
                  onClick={() => setShowSocial(false)}
                  className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-xl shadow-rose-500/25">
                    <Heart className="w-7 h-7 text-white fill-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">تواصل معنا لإنشاء دعوتك</h3>
                  <p className="text-white/40 text-xs">اختر وسيلة التواصل المناسبة لك وسنساعدك فوراً</p>
                </div>

                {/* Social Buttons */}
                <div className="space-y-3">
                  <a
                    href={SOCIAL_LINKS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group"
                    style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,211,102,0.15)' }}>
                      <MessageCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-white font-semibold text-sm">واتساب (WhatsApp)</p>
                      <p className="text-emerald-400/70 text-xs">تواصل فوري ومباشر</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors rotate-180" />
                  </a>

                  <a
                    href={SOCIAL_LINKS.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group"
                    style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.15)' }}>
                      <Facebook className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-white font-semibold text-sm">فيسبوك (Facebook)</p>
                      <p className="text-blue-400/70 text-xs">صفحتنا الرسمية</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors rotate-180" />
                  </a>

                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group"
                    style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)' }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(168,85,247,0.15)' }}>
                      <Instagram className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-white font-semibold text-sm">إنستغرام (Instagram)</p>
                      <p className="text-violet-400/70 text-xs">تصفح نماذج الدعوات</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors rotate-180" />
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
