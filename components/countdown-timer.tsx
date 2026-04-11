'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
        setIsExpired(false);
      } else {
        setIsExpired(true);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="text-center p-6 bg-gradient-to-r from-pink-100 to-blue-100 rounded-lg animate-slideInUp">
        <p className="text-lg font-semibold text-gray-900 animate-pulse">Event is happening now! 🎉</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4 animate-fadeIn">
      <div className="text-center animate-slideInUp stagger-1">
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 text-white hover:shadow-lg transition-shadow hover:scale-105 duration-300">
          <div className="text-3xl font-bold animate-pulse-slow">{timeLeft.days}</div>
          <div className="text-xs uppercase tracking-wide">Days</div>
        </div>
      </div>
      <div className="text-center animate-slideInUp stagger-2">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white hover:shadow-lg transition-shadow hover:scale-105 duration-300">
          <div className="text-3xl font-bold animate-pulse-slow">{String(timeLeft.hours).padStart(2, '0')}</div>
          <div className="text-xs uppercase tracking-wide">Hours</div>
        </div>
      </div>
      <div className="text-center animate-slideInUp stagger-3">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white hover:shadow-lg transition-shadow hover:scale-105 duration-300">
          <div className="text-3xl font-bold animate-pulse-slow">{String(timeLeft.minutes).padStart(2, '0')}</div>
          <div className="text-xs uppercase tracking-wide">Mins</div>
        </div>
      </div>
      <div className="text-center animate-slideInUp stagger-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white hover:shadow-lg transition-shadow hover:scale-105 duration-300">
          <div className="text-3xl font-bold animate-pulse-slow">{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div className="text-xs uppercase tracking-wide">Secs</div>
        </div>
      </div>
    </div>
  );
}
