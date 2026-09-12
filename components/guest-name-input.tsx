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
      setTimeout(() => {
        onNameSubmit(guestName.trim());
      }, 300);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060a14] p-4 font-normal-text relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-slideInUp">
        <div className="luxury-card-frame p-8 text-center border border-amber-500/30 shadow-2xl">
          {/* Welcome Message */}
          <div className="mb-6 space-y-3">
            <span className="text-4xl">💌</span>
            <p className="text-amber-200/70 text-sm tracking-widest uppercase font-semibold">دعوة خاصة</p>
            <h2 className="text-3xl md:text-4xl font-bold font-ruqah-bold gold-foil-text">
              {eventTitle}
            </h2>
            <p className="text-white/50 text-sm">من تنظيم: <span className="text-white/80 font-medium">{hostName}</span></p>
          </div>

          {/* Main Content */}
          <div className="mb-6 space-y-4">
            <p className="text-white/70 text-sm leading-relaxed">
              يسعدنا التعرف على اسمك الكريم لعرض دعوة الحضور المخصصة لك
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="أدخل اسمك الكريم هنا..."
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  disabled={isSubmitting}
                  className="text-lg py-6 px-4 rounded-xl text-center border-amber-500/30 bg-white/5 text-white placeholder-white/30 focus:border-amber-400 focus:outline-none font-ruqah-bold"
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                disabled={!guestName.trim() || isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-600 hover:to-rose-600 text-white font-bold py-6 rounded-xl transition-all shadow-xl hover:scale-[1.02] cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري التجهيز...
                  </span>
                ) : (
                  "افتح الدعوة المخصصة ✨"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
