import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import EventModel from '@/lib/db/models/Event';

// POST /api/events/[id]/view
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const { guestName } = await req.json();
    const viewerId = `${guestName}-${Date.now()}`;

    await EventModel.findByIdAndUpdate(id, {
      $inc: { views: 1 },
      $push: { uniqueViewers: viewerId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/events/[id]/view]', err);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}
