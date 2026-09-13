'use client';

import { Event } from '@/lib/context/app-context';
import { Section, SectionTitle } from './invite-helpers';
import { arDate, arTime, downloadICS } from './invite-types';
import { Calendar, Clock, CalendarPlus } from 'lucide-react';

interface InviteDateTimeProps {
  event: Event;
}

export function InviteDateTime({ event }: InviteDateTimeProps) {
  return (
    <Section className="px-4 py-16">
      <div className="max-w-xl mx-auto text-center space-y-8">
        <SectionTitle>توقيت الحفل</SectionTitle>

        <div className="luxury-card-frame bg-white/95 p-8 md:p-10 space-y-6 border border-amber-500/40 shadow-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="p-3 rounded-2xl bg-amber-100 border border-amber-300">
              <Calendar className="w-6 h-6 text-amber-700" aria-hidden="true" />
            </div>
            <div className="text-right flex-1">
              <p className="text-slate-500 text-xs mb-1 font-bold">تاريخ اليوم السعيد</p>
              <p className="text-slate-900 text-xl font-bold font-normal-text">{arDate(event.dateTime)}</p>
            </div>
          </div>

          <div className="w-full h-px bg-amber-200/60" />

          <div className="flex items-center justify-between gap-4">
            <div className="p-3 rounded-2xl bg-amber-100 border border-amber-300">
              <Clock className="w-6 h-6 text-amber-700" aria-hidden="true" />
            </div>
            <div className="text-right flex-1">
              <p className="text-slate-500 text-xs mb-1 font-bold">توقيت الاستقبال</p>
              <p className="text-amber-800 text-2xl font-bold font-normal-text">في تمام {arTime(event.dateTime)}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-amber-200/60">
            <button
              onClick={() => downloadICS(event.title, event.dateTime, event.location)}
              className="w-full py-3.5 rounded-xl bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300 text-amber-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70 shadow-sm"
            >
              <CalendarPlus className="w-4 h-4 text-amber-700" aria-hidden="true" />
              <span>إضافة المناسبة إلى التقويم</span>
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
