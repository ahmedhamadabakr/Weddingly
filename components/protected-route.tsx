'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context/app-context';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { currentUser } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser.isAuthenticated) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [currentUser.isAuthenticated, router]);

  if (isLoading || !currentUser.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
