export interface MusicTrack {
  id: string;
  name: string;
  nameAr: string;
  emoji: string;
  genre: string;
  gradientFrom: string;
  gradientTo: string;
  url: string;
}

export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'romantic-piano',
    name: 'Romantic Piano',
    nameAr: 'بيانو رومانسي',
    emoji: '🎹',
    genre: 'كلاسيك',
    gradientFrom: '#e8627a',
    gradientTo: '#f43f5e',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 'arabic-vibes',
    name: 'Arabic Vibes',
    nameAr: 'موسيقى عربية',
    emoji: '🪘',
    genre: 'عربي',
    gradientFrom: '#f59e0b',
    gradientTo: '#f97316',
    url: '/music.mp3',
  },
  {
    id: 'classical-strings',
    name: 'Classical Strings',
    nameAr: 'أوتار كلاسيكية',
    emoji: '🎻',
    genre: 'كلاسيك',
    gradientFrom: '#a855f7',
    gradientTo: '#7c3aed',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 'wedding-bells',
    name: 'Wedding Bells',
    nameAr: 'أجراس الزفاف',
    emoji: '🔔',
    genre: 'زفاف',
    gradientFrom: '#eab308',
    gradientTo: '#d97706',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: 'gentle-melody',
    name: 'Gentle Melody',
    nameAr: 'لحن هادئ',
    emoji: '🎵',
    genre: 'هادئ',
    gradientFrom: '#14b8a6',
    gradientTo: '#06b6d4',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: 'soft-ambient',
    name: 'Soft Ambient',
    nameAr: 'موسيقى خلفية',
    emoji: '🌙',
    genre: 'هادئ',
    gradientFrom: '#3b82f6',
    gradientTo: '#6366f1',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  },
];

export function getTrackById(id?: string): MusicTrack {
  return MUSIC_TRACKS.find((t) => t.id === id) ?? MUSIC_TRACKS[0];
}
