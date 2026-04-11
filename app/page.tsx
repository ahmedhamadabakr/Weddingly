'use client';

import Link from 'next/link';
import { useAppContext } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { currentUser } = useAppContext();

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 animate-fadeIn">
      <nav className="flex justify-between items-center p-6 bg-white shadow-sm animate-slideInDown">
        <h1 className="text-2xl font-bold text-gray-800">EventInvite</h1>
        <div className="flex gap-4">
          {currentUser.isAuthenticated ? (
            <Link href="/dashboard">
              <Button className="hover:scale-105 transition-transform">Dashboard</Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="hover:scale-105 transition-transform">Admin Login</Button>
            </Link>
          )}
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <div className="text-center max-w-2xl animate-slideInUp">
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-float" />
          <div className="absolute bottom-32 right-10 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '0.5s' }} />
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6 animate-slideInDown">
            Create Beautiful
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500"> Event Invitations</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 animate-slideInUp">
            Design and share stunning digital invitations for your special events. Manage RSVPs, track guests, and make event planning effortless.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideInUp">
            {currentUser.isAuthenticated ? (
              <>
                <Link href="/dashboard/create">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 hover:scale-105 transition-transform">
                    Create Event
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto hover:scale-105 transition-transform">
                    View Events
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 hover:scale-105 transition-transform">
                    Get Started
                  </Button>
                </Link>
                <Link href="/invite/demo-wedding-abcd1234">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto hover:scale-105 transition-transform">
                    See Demo
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-5xl w-full">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">✨</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Beautiful Templates</h3>
            <p className="text-gray-600">Stunning invitation designs perfect for weddings, engagements, and more.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track RSVPs</h3>
            <p className="text-gray-600">Manage guest lists and track responses in real-time from your dashboard.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Shareable Links</h3>
            <p className="text-gray-600">Generate unique shareable links and QR codes for easy distribution.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
