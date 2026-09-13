export interface SplitNames {
  name1: string;
  name2: string;
}

/* ───── Helper: Split Groom & Bride names ───── */
export const splitNames = (title: string): SplitNames => {
  if (!title) return { name1: '', name2: '' };
  
  // 1) Explicit separators with spaces or symbols
  for (const sep of [' & ', ' and ', '&', ' + ', ' و ', ' - ', ' / ', ' | ']) {
    if (title.includes(sep)) {
      const parts = title.split(sep).map((s) => s.trim());
      if (parts[0] && parts[1]) {
        return { name1: parts[0], name2: parts.slice(1).join(` ${sep.trim()} `) };
      }
    }
  }

  // 2) Handle Arabic "اسم1 واسم2" (e.g. "محمود ونرمين") where 'و' has no space before the second name
  const wawMatch = title.match(/^(.+?)\s+و\s*(.+)$/) || title.match(/^(.+?)\s+و(.+)$/);
  if (wawMatch && wawMatch[1] && wawMatch[2]) {
    return { name1: wawMatch[1].trim(), name2: wawMatch[2].trim() };
  }

  // 3) Handle hyphen without spaces "محمود-نرمين"
  if (title.includes('-')) {
    const parts = title.split('-').map((s) => s.trim());
    if (parts[0] && parts[1]) {
      return { name1: parts[0], name2: parts[1] };
    }
  }

  return { name1: title, name2: '' };
};

/* ───── Helper: Date & Time in Arabic ───── */
export const arDate = (d: Date) =>
  new Date(d).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export const arTime = (d: Date) =>
  new Date(d).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

/* ───── Helper: Download .ics calendar invite ───── */
export const downloadICS = (title: string, dateTime: Date, location: string) => {
  const startDate = new Date(dateTime).toISOString().replace(/-|:|\.\d+/g, '');
  const endDate = new Date(new Date(dateTime).getTime() + 4 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d+/g, '');
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Weddingly//NONSGML Invitation//AR',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    'DESCRIPTION:ننتظر إطلالتكم البهية لتنيروا حفلنا المبارك.',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${title}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/* ───── Helper: Ensure absolute valid Google Maps URL ───── */
export const formatGoogleMapsUrl = (url?: string, location?: string) => {
  if (url && url.trim()) {
    let cleanUrl = url.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }
    return cleanUrl;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location || '')}`;
};
