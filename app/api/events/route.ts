import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import EventModel from '@/lib/db/models/Event';

function generateSlug(title: string): string {
  const sanitized = title
    .trim()
    .replace(/\s+/g, '-')                                               // مسافات → شرطات
    .replace(/[^\u0600-\u06FF\u0750-\u077Fa-zA-Z0-9-]/g, '')           // احتفظ بالعربي + اللاتيني + الأرقام
    .replace(/-+/g, '-')                                                // ادمج شرطات متكررة
    .replace(/^-|-$/g, '');                                             // شيل الشرطات من الأطراف
  const random = Math.random().toString(36).substring(2, 6);           // 4 حروف عشوائية لتفادي التكرار
  return `${sanitized}-${random}`;
}

// GET /api/events — fetch all events
export async function GET() {
  try {
    await connectDB();
    const events = await EventModel.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ events });
  } catch (err) {
    console.error('[GET /api/events]', err);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events — create a new event
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      title, type, hostName, dateTime, location, message,
      coverImage, musicTrack, customMusicUrl, theme,
    } = body;

    if (!title || !type || !hostName || !dateTime || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = generateSlug(title);

    const event = await EventModel.create({
      title,
      type,
      hostName,
      dateTime: new Date(dateTime),
      location,
      message:        message       ?? '',
      coverImage:     coverImage     ?? '',
      slug,
      guests:         [],
      views:          0,
      uniqueViewers:  [],
      musicTrack:     musicTrack     ?? 'arabic-vibes',
      customMusicUrl: customMusicUrl ?? '',
      theme:          theme          ?? { primary: '#e8627a', secondary: '#7c3aed' },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/events]', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
