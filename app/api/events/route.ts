import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import EventModel from '@/lib/db/models/Event';

async function generateUniqueSlug(title: string): Promise<string> {
  const sanitized = title
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FF\u0750-\u077Fa-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'invite';

  let candidateSlug = sanitized;
  let counter = 1;

  while (await EventModel.findOne({ slug: candidateSlug }).lean()) {
    counter++;
    candidateSlug = `${sanitized}-${counter}`;
  }

  return candidateSlug;
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
      coverImage, musicTrack, customMusicUrl, googleMapsUrl, theme,
    } = body;

    if (!title || !type || !hostName || !dateTime || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const slug = await generateUniqueSlug(title);

    const event = await EventModel.create({
      title,
      type,
      hostName,
      dateTime: new Date(dateTime),
      location,
      message:        message        ?? '',
      coverImage:     coverImage     ?? '',
      slug,
      guests:         [],
      views:          0,
      uniqueViewers:  [],
      musicTrack:     musicTrack     ?? 'arabic-vibes',
      customMusicUrl: customMusicUrl ?? '',
      googleMapsUrl:  googleMapsUrl  ?? '',
      theme:          theme          ?? { primary: '#e8627a', secondary: '#7c3aed' },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/events]', err);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
