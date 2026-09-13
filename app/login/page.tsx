'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppContext } from '@/lib/context/app-context';
import { Heart, Lock, ArrowLeft, Loader2, Eye, EyeOff, KeyRound } from 'lucide-react';

function LoginForm() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { loginWithEventPasscode } = useAppContext();
  const [passcode, setPasscode] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = loginWithEventPasscode(passcode);
      if (result.success) {
        const from = searchParams.get('from');
        if (from) {
          router.push(from);
        } else if (result.eventId) {
          router.push(`/dashboard/events/${result.eventId}`);
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(result.error || 'رمز الدخول غير صحيح، حاول مرة أخرى');
        setLoading(false);
      }
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      {/* Card */}
      <div className="luxury-card p-8 space-y-8">

        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-xl shadow-rose-500/25">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Weddingly</h1>
            <p className="text-white/40 text-sm mt-1">دخول إحصائيات وإدارة الدعوة 🔑</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center space-y-1">
          <p className="text-white font-medium text-xs">لكل دعوة كلمة سر خاصة بها</p>
          <p className="text-white/40 text-[11px]">
            أدخل كلمة سر دعوتك للدخول لمتابعة الضيوف والتعديل، أو كلمة سر الأدمن العام.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              كلمة السر / رمز دخول الدعوة 🔑
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/70" />
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="أدخل كلمة سر دعوتك (مثال: 1234)"
                disabled={loading}
                className="luxury-input w-full pl-10 pr-10 py-3 text-sm disabled:opacity-50 font-mono"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !passcode.trim()}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #e8627a, #f43f5e)',
              boxShadow: '0 4px 20px rgba(232, 98, 122, 0.25)',
            }}
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري التحقق...</> : 'دخول الدعوة ✨'}
          </button>
        </form>

        <Link href="/" className="flex items-center justify-center gap-1.5 text-white/30 hover:text-white/60 text-sm transition-colors pt-2">
          <ArrowLeft className="w-3.5 h-3.5" />
          العودة للرئيسية
        </Link>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <main className="luxury-bg min-h-screen flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-rose-500/6 blur-[130px]" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-500/6 blur-[130px]" />
      </div>

      <Suspense
        fallback={
          <div className="w-16 h-16 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
