'use client';

import Link from 'next/link';
import { RingsMark } from './invite-helpers';
import { Lock } from 'lucide-react';

interface InviteFooterProps {
  eventId: string;
}

export function InviteFooter({ eventId }: InviteFooterProps) {
  return (
    <footer className="relative z-10 py-12 text-center space-y-3 font-normal-text border-t border-amber-200/80 bg-[#f7f3eb]">
      <div className="flex justify-center text-amber-700/70">
        <RingsMark className="w-9 h-5" />
      </div>
      <p className="text-amber-900 text-sm font-ruqah-bold font-bold">صُمّمت بكل حب وأناقة بواسطة Weddingly</p>
      <Link
        href={`/login?from=/dashboard/events/${eventId}`}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/5 hover:bg-amber-900/10 text-amber-900/70 hover:text-amber-900 text-xs font-semibold transition-colors"
      >
        <Lock className="w-3.5 h-3.5" />
        <span>لوحة إدارة ومتابعة هذه الدعوة 🔑</span>
      </Link>
      <p className="text-slate-600 text-xs pt-1">
        جميع الحقوق محفوظة لـ{' '}
        <a
          href="https://www.connectxsolutions.online/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-800 hover:underline font-bold"
        >
          ConnectX Solutions
        </a>{' '}
        © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
