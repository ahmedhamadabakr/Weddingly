'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import QRCode from "react-qr-code";
import { Playfair_Display, Dancing_Script, Inter ,Amiri, Reem_Kufi} from 'next/font/google';
import { useAppContext } from '@/lib/context/app-context';
import { RSVPForm } from '@/components/rsvp-form';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'] });
const dancingScript = Dancing_Script({ subsets: ['latin'], weight: ['400', '700'] });
const inter = Inter({ subsets: ['latin'] });

const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'] });
const ruqaa = Reem_Kufi({ subsets: ['arabic'], weight: ['400', '700'] });

/**
 * Splits the event title into two names if a separator exists
 */
const formatNames = (title: string) => {
  const separators = [' & ', ' and ', ' &', '& ', ' AND ', ' And '];
  let parts = [title];
  
  for (const sep of separators) {
    if (title.includes(sep)) {
      parts = title.split(sep).map(p => p.trim());
      break;
    }
  }
  
  if (parts.length === 1) return { name1: parts[0], name2: '' };
  return { name1: parts[0], name2: parts[1] };
};

export default function InvitationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { getEventBySlug } = useAppContext();
  const event = getEventBySlug(slug);

  const [opened, setOpened] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { scrollYProgress, scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    audioRef.current = new Audio('/music.mp3');
    audioRef.current.loop = true;
  }, []);

  const handleOpen = () => {
    setOpened(true);
    audioRef.current?.play().catch(() => {});
  };

  const DecorativeBlob = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, 90, 0],
        opacity: 0.3
      }}
      transition={{ 
        duration: 20, 
        repeat: Infinity, 
        delay 
      }}
      className={`fixed rounded-full blur-3xl pointer-events-none -z-10 ${className}`}
    />
  );

  const HeartIcon = ({ i }: { i: number }) => (
    <motion.div
      initial={{ y: "110vh", opacity: 0, scale: 0.5 }}
      animate={{ 
        y: "-10vh", 
        opacity: [0, 0.6, 0.6, 0],
        scale: [0.5, 1.2, 0.8],
        x: Math.sin(i) * 20 + "vw" 
      }}
      transition={{ 
        duration: 8 + Math.random() * 7, 
        repeat: Infinity, 
        ease: "linear",
        delay: i * 0.8 
      }}
      className="fixed text-pink-300/40 pointer-events-none z-0 text-2xl"
      style={{ left: (i * 7) % 100 + "vw" }}
    >
      ❤️
    </motion.div>
  );

  if (!event) {
    return <div className="h-screen flex items-center justify-center">Invitation Not Found</div>;
  }

  const lightPink = '#fff5f7';

  // 🎬 Intro Screen
  if (!opened) {
    return (
      <div
        className={`h-screen flex flex-col items-center justify-center text-center p-6 bg-[#fff5f7] ${ruqaa.className}`}
      >
        {[...Array(15)].map((_, i) => <HeartIcon key={i} i={i} />)}
        
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl mb-6 text-pink-800"
        >
          بكل الحب ننتظركم
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 text-2xl text-pink-700 italic">
          "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا"
        </motion.p>

        <button
          onClick={handleOpen}
          className="px-12 py-4 bg-pink-600 text-white rounded-full shadow-2xl hover:bg-pink-700 transform hover:scale-110 transition duration-300 font-bold text-xl"
        >
          افتح الدعوة ✨
        </button>
      </div>
    );
  }

  return (
    <main className={`overflow-x-hidden relative ${amiri.className} bg-[#fff5f7] min-h-screen`}>
      {[...Array(20)].map((_, i) => <HeartIcon key={i} i={i} />)}

      {/* 🔥 Scroll Progress */}
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="fixed top-0 left-0 right-0 h-2 bg-pink-500 origin-left z-50 shadow-sm"
      />

      {/* 🎥 Hero */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4 relative z-10">
        <motion.div style={{ y: parallaxY }} className="space-y-8">
          <motion.p 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            className="text-3xl text-pink-800"
          >
            تزدان الليالي بلقائكم
          </motion.p>
          
          <h1 className={`text-7xl md:text-9xl font-bold text-pink-900 drop-shadow-lg ${ruqaa.className}`}>
            {event.title}
          </h1>

          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "150px" }}
            className="h-1 bg-pink-400 mx-auto rounded-full"
          />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-3xl text-pink-700">
            دعوة من القلب لمن سكنوا القلب
          </motion.p>
        </motion.div>
      </section>

      {/* 📜 Poem/Message Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-8 relative z-10 bg-white/20 backdrop-blur-md border-y border-pink-100">
        <motion.div 
          whileInView={{ opacity: 1, scale: 1 }} 
          initial={{ opacity: 0, scale: 0.95 }}
          className="max-w-3xl space-y-10"
        >
          <p className="text-4xl md:text-5xl leading-relaxed text-pink-900 italic font-medium">
            "بأجمل عبارات الود والترحيب، وبقلوبٍ يملؤها السرور، يسعدنا أن نرحب بكم في ليلةٍ تفيض بهجةً بمشاركتكم، ليلةٌ لا تكتمل فرحتنا فيها إلا بوجودكم."
          </p>
          <p className={`text-5xl text-pink-800 ${ruqaa.className}`}>
            الفرحة لا تكتمل إلا بوجود الأهل والأحباب
          </p>
        </motion.div>
      </section>

      {/* 📅 Date */}
      <section className="h-screen flex flex-col items-center justify-center text-center relative z-10 px-4">
        <h2 className="text-4xl text-pink-800 mb-12 font-bold">موعدنا المنتظر</h2>
        <motion.div
          whileInView={{ scale: 1.05, y: 0 }}
          initial={{ y: 20 }}
          className="bg-white/80 p-16 rounded-3xl shadow-2xl border-2 border-pink-50"
        >
          <div className="text-5xl md:text-6xl font-bold text-pink-900 mb-6 underline decoration-pink-200">
            {new Date(event.dateTime).toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="text-3xl text-pink-700">
            في تمام الساعة {new Date(event.dateTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </motion.div>
      </section>

      {/* 📍 Location */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4 relative z-10">
        <motion.h2 
          whileInView={{ opacity: 1, y: 0 }} 
          initial={{ opacity: 0, y: 50 }} 
          className={`text-5xl mb-10 text-pink-900 font-bold ${ruqaa.className}`}
        >
          📍 مكان اللقاء
        </motion.h2>

        <motion.p 
          whileInView={{ opacity: 1 }} 
          initial={{ opacity: 0 }}
          className="text-4xl text-pink-800 bg-white/60 px-12 py-6 rounded-2xl shadow-lg border border-pink-100"
        >
          {event.location}
        </motion.p>
        <p className="mt-8 text-2xl text-pink-600 italic">"ننتظر إطلالتكم البهية لتنير الحفل"</p>
      </section>

      {/* 🧾 RSVP */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10 py-20">
        <h2 className={`text-5xl mb-12 text-pink-900 ${ruqaa.className}`}>تأكيد الحضور</h2>
        <RSVPForm eventId={event.id} />
      </section>

      {/* 🔗 QR */}
      <section className="h-screen flex flex-col items-center justify-center text-center relative z-10 bg-pink-100/30">
        <p className="mb-8 text-pink-800 text-2xl font-bold">شاركنا الفرحة عبر الرابط</p>
        <QRCode
          value={typeof window !== 'undefined' ? window.location.href : ''}
          size={180}
          fgColor="#880e4f"
          bgColor="transparent"
        />
      </section>

      {/* 🎵 Music Control */}
      <button
        onClick={() => {
          if (audioRef.current?.paused) {
            audioRef.current.play();
          } else {
            audioRef.current?.pause();
          }
        }}
        className="fixed bottom-8 right-8 bg-rose-600 text-white p-5 rounded-full shadow-2xl z-50 hover:bg-rose-700 transition scale-110 md:scale-125"
      >
        🔊
      </button>
    </main>
  );
}