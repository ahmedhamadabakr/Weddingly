'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppContext();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials for simplicity
  const DEMO_PASSWORD = 'admin123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (password === DEMO_PASSWORD) {
        login();
        router.push('/dashboard');
      } else {
        setError('Invalid password');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center px-4 animate-fadeIn">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-float" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '0.5s' }} />
      
      <Card className="w-full max-w-md p-8 animate-slideInUp relative z-10">
        <div className="mb-8 text-center animate-fadeIn">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EventInvite</h1>
          <p className="text-gray-600">Admin Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="animate-fadeIn stagger-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              disabled={isLoading}
              className="w-full border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors disabled:opacity-50 py-2 rounded-lg"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg animate-slideInDown">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-fadeIn stagger-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <p className="text-sm text-gray-600 mt-6 text-center animate-fadeIn stagger-3">
          Demo password: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code>
        </p>

        <Link href="/" className="block mt-6 text-center text-sm text-blue-600 hover:text-blue-700 hover:scale-105 transition-transform animate-fadeIn stagger-4">
          Back to Home
        </Link>
      </Card>
    </main>
  );
}
