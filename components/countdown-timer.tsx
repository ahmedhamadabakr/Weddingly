'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  targetDate: Date;
  primaryColor?: string;
}

export function CountdownTimer({ targetDate, primaryColor = '#d4a853' }: CountdownTimerProps) {
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
      <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-amber-500/20 border border-amber-500/30 backdrop-blur-md animate-pulse">
        <p className="text-xl font-bold text-amber-200 font-normal-text">✨ الحفل قيد الانعقاد الآن! أهلاً وسهلاً بكم 🎉</p>
      </div>
    );
  }

  const items = [
    { label: 'أيام', value: timeLeft.days },
    { label: 'ساعات', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'دقائق', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'ثواني', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-4 font-normal-text">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="luxury-card p-3 md:p-4 text-center rounded-2xl border border-amber-500/20 hover:border-amber-500/50 transition-all duration-300 shadow-xl"
          style={{ background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(12px)' }}
        >
          <div
            className="text-2xl md:text-4xl font-extrabold tracking-tight mb-1"
            style={{
              color: primaryColor,
              textShadow: `0 0 20px ${primaryColor}40`,
            }}
          >
            {item.value}
          </div>
          <div className="text-[11px] md:text-xs font-semibold text-white/50 tracking-wider">
            {item.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
