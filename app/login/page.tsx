'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAppContext } from '@/lib/context/app-context';
import { Heart, Lock, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';

// Password is set in ADMIN_PASSWORD env var (falls back to 'admin123' for local dev)
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const { login }    = useAppContext();
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      if (password === DEMO_PASSWORD) {
        login();
        const from = searchParams.get('from') || '/dashboard';
        router.push(from);
      } else {
        setError('كلمة المرور غير صحيحة، حاول مرة أخرى');
        setLoading(false);
      }
    }, 700);
  };

  return (
    <main className="luxury-bg min-h-screen flex items-center justify-center px-4">
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-rose-500/6 blur-[130px]" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-500/6 blur-[130px]" />
      </div>

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
              <p className="text-white/35 text-sm mt-1">دخول لوحة التحكم</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  disabled={loading}
                  className="luxury-input w-full pl-10 pr-10 py-3 text-sm disabled:opacity-50"
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
                className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #e8627a, #f43f5e)',
                boxShadow: '0 4px 20px rgba(232, 98, 122, 0.25)',
              }}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الدخول...</> : 'دخول →'}
            </button>
          </form>


          <Link href="/" className="flex items-center justify-center gap-1.5 text-white/30 hover:text-white/60 text-sm transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            العودة للرئيسية
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
