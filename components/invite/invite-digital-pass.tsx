'use client';

import { useState } from 'react';
import QRCode from 'react-qr-code';
import { Section, SectionTitle } from './invite-helpers';
import { Share2, CheckCircle } from 'lucide-react';

interface InviteDigitalPassProps {
  eventTitle: string;
  inviteUrl: string;
}

export function InviteDigitalPass({ eventTitle, inviteUrl }: InviteDigitalPassProps) {
  const [copied, setCopied] = useState(false);

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`دعوة حضور حفل ${eventTitle}\nيسعدنا حضوركم وتشريفكم لنا\n\nرابط الدعوة:\n${inviteUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Section className="px-4 py-16">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="space-y-2">
          <SectionTitle>بطاقة الحضور الرقمية</SectionTitle>
          <p className="text-slate-600 text-xs font-bold font-normal-text">امسح الكود أو شارك الرابط مع الأحباب</p>
        </div>

        <div className="relative rounded-[28px] bg-slate-950 text-white p-8 shadow-2xl overflow-hidden">
          {/* perforated ticket-stub edge */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-[-8px] pointer-events-none">
            <div className="w-6 h-6 rounded-full bg-[#faf8f5] -translate-x-1/2" />
            <div className="w-6 h-6 rounded-full bg-[#faf8f5] translate-x-1/2" />
          </div>
          <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-[28px]" />

          <div className="relative p-4 rounded-2xl bg-white inline-block mx-auto shadow-md">
            <QRCode value={inviteUrl} size={160} fgColor="#0f172a" bgColor="#ffffff" />
          </div>

          <p className="relative mt-6 text-amber-200/90 text-xs font-mono break-all bg-white/5 p-2.5 rounded-lg border border-white/10">
            {inviteUrl}
          </p>

          <div className="relative grid grid-cols-2 gap-3 pt-6">
            <button
              onClick={handleShareWhatsApp}
              aria-label="مشاركة عبر واتساب"
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70"
            >
              <Share2 className="w-4 h-4" aria-hidden="true" />
              <span>واتساب</span>
            </button>

            <button
              onClick={handleCopyLink}
              aria-label={copied ? 'تم نسخ الرابط' : 'نسخ الرابط'}
              className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-amber-100 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/70"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" /> : <Share2 className="w-4 h-4 text-amber-200" aria-hidden="true" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الرابط'}</span>
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
