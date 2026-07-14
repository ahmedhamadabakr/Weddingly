'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context/app-context';
import { Heart } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { currentUser } = useAppContext();

  // Three states: 'checking' | 'authorized' | 'unauthorized'
  const [authState, setAuthState] = useState<'checking' | 'authorized' | 'unauthorized'>('checking');

  useEffect(() => {
    // Wait one tick for localStorage → context hydration to finish
    const timer = setTimeout(() => {
      if (currentUser.isAuthenticated) {
        setAuthState('authorized');
      } else {
        setAuthState('unauthorized');
        router.replace('/login');
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [currentUser.isAuthenticated, router]);

  // Watch for auth state changes after initial check
  useEffect(() => {
    if (authState === 'authorized' && !currentUser.isAuthenticated) {
      setAuthState('unauthorized');
      router.replace('/login');
    }
    if (authState === 'unauthorized' && currentUser.isAuthenticated) {
      setAuthState('authorized');
    }
  }, [currentUser.isAuthenticated, authState, router]);

  // ── Loading screen (luxury dark themed) ──
  if (authState !== 'authorized') {
    return (
      <div className="luxury-bg min-h-screen flex flex-col items-center justify-center gap-6">
        {/* Ambient blobs */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-rose-500/5 blur-[130px]" />
          <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-violet-500/5 blur-[130px]" />
        </div>

        {/* Logo spinner */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-xl shadow-rose-500/25">
            <Heart className="w-8 h-8 text-white fill-white" />
          </div>
          {/* Ring spinner around logo */}
          <div className="absolute -inset-1.5 rounded-[18px] border-2 border-transparent border-t-rose-500/60 animate-spin" />
        </div>

        <p className="text-white/30 text-sm tracking-wide">جاري التحقق من الصلاحيات...</p>
      </div>
    );
  }

  return <>{children}</>;
}
