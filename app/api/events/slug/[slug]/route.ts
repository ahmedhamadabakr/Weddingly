import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import EventModel from '@/lib/db/models/Event';

// GET /api/events/slug/[slug]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();
    const event = await EventModel.findOne({ slug }).lean();
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ event });
  } catch (err) {
    console.error('[GET /api/events/slug/[slug]]', err);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}
