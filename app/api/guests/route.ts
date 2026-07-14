import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import EventModel from '@/lib/db/models/Event';

// POST /api/guests — add RSVP guest to an event
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { eventId, name, numAttendees } = await req.json();

    if (!eventId || !name || !numAttendees) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newGuest = {
      id:           Math.random().toString(36).substring(2, 9),
      name,
      numAttendees: Number(numAttendees),
      timestamp:    new Date(),
    };

    const event = await EventModel.findByIdAndUpdate(
      eventId,
      { $push: { guests: newGuest } },
      { new: true }
    ).lean();

    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

    return NextResponse.json({ guest: newGuest }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/guests]', err);
    return NextResponse.json({ error: 'Failed to add guest' }, { status: 500 });
  }
}
