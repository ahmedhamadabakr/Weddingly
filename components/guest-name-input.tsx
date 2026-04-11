'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GuestNameInputProps {
  onNameSubmit: (name: string) => void;
  eventTitle: string;
  hostName: string;
}

export function GuestNameInput({ onNameSubmit, eventTitle, hostName }: GuestNameInputProps) {
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guestName.trim()) {
      setIsSubmitting(true);
      // Small delay for animation effect
      setTimeout(() => {
        onNameSubmit(guestName.trim());
      }, 300);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-blue-50 p-4 animate-fadeIn">
      <div className="w-full max-w-md animate-slideInUp">
        {/* Decorative Background Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-pink-200 rounded-full opacity-20 animate-float" />
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '0.5s' }} />
        
        <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
          {/* Welcome Message */}
          <div className="mb-8 text-center animate-fadeIn stagger-1">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              You&apos;re Invited!
            </h2>
            <p className="text-gray-600 text-lg font-semibold">{eventTitle}</p>
            <p className="text-gray-500 text-sm mt-2">by {hostName}</p>
          </div>

          {/* Main Content */}
          <div className="mb-8 animate-fadeIn stagger-2">
            <p className="text-gray-700 text-center mb-6">
              Please enter your name to view your personalized invitation
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  disabled={isSubmitting}
                  className="text-lg py-3 px-4 rounded-lg border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={!guestName.trim() || isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "View Your Invitation"
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 animate-fadeIn stagger-3">
            <p>RSVP to confirm your attendance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
