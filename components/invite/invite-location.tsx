'use client';

import { Event } from '@/lib/context/app-context';
import { Section, SectionTitle } from './invite-helpers';
import { formatGoogleMapsUrl } from './invite-types';
import { MapPin, Navigation } from 'lucide-react';

interface InviteLocationProps {
  event: Event;
}

export function InviteLocation({ event }: InviteLocationProps) {
  return (
    <Section className="px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <SectionTitle>موقع الاحتفال</SectionTitle>

        <div className="luxury-card-frame bg-white/95 p-6 md:p-10 space-y-6 border border-amber-500/40 shadow-xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center shadow-xl">
            <MapPin className="w-8 h-8 text-white" aria-hidden="true" />
          </div>

          <div className="space-y-2">
            <p className="text-slate-500 text-xs font-bold">عنوان القاعة / المكان</p>
            <p className="text-slate-900 text-2xl font-bold leading-relaxed font-normal-text">{event.location}</p>
          </div>

          <p className="text-amber-900/90 text-sm italic font-semibold">
            &ldquo;ننتظر إطلالتكم الميمونة لتزيدوا حفلنا إشراقاً وأنساً&rdquo;
          </p>

          <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-amber-300 shadow-inner my-4 relative">
            <iframe
              title="خريطة الموقع"
              width="100%"
              height="100%"
              className="w-full h-full border-0 transition-all duration-500"
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent(event.googleMapsUrl || event.location)}&output=embed`}
            />
          </div>

          <div className="pt-4 border-t border-amber-200/60">
            <a
              href={formatGoogleMapsUrl(event.googleMapsUrl, event.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
            >
              <Navigation className="w-5 h-5 text-slate-950 fill-slate-950" aria-hidden="true" />
              <span>افتح الموقع على خرائط Google</span>
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
