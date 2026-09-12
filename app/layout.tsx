import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Aref_Ruqaa, Cairo, Amiri, Reem_Kufi } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AppProvider } from '@/lib/context/app-context'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const arefRuqaa = Aref_Ruqaa({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-aref-ruqaa',
  display: 'swap',
});

const cairo = Cairo({
  subsets: ['arabic'],
  variable: '--font-cairo',
  display: 'swap',
});

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-amiri',
  display: 'swap',
});

const reemKufi = Reem_Kufi({
  subsets: ['arabic'],
  variable: '--font-reem-kufi',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Weddingly — دعوات زفاف رقمية فاخرة',
  description: 'صمّم دعوات زفاف وخطوبة رقمية مذهلة، شارك روابطها مع ضيوفك، وتابع تأكيدات الحضور في لحظتها.',
  generator: 'Weddingly',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        sizes: '32x32',
        type: 'image/png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: {
      url: '/apple-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
    shortcut: '/icon-512.png',
  },
  applicationName: 'Weddingly',
  keywords: ['دعوات زفاف', 'دعوات رقمية', 'زفاف', 'خطوبة', 'كتب كتاب', 'دعوة إلكترونية'],
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${arefRuqaa.variable} ${cairo.variable} ${amiri.variable} ${reemKufi.variable}`}>
      <body className="font-normal-text font-sans antialiased bg-[#060a14] text-white">
        <AppProvider>
          {children}
        </AppProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
