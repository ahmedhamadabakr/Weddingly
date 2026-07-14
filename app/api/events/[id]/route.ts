import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import EventModel from '@/lib/db/models/Event';

// GET /api/events/[id]
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const event = await EventModel.findById(id).lean();
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ event });
  } catch (err) {
    console.error('[GET /api/events/[id]]', err);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// PUT /api/events/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await req.json();

    // Prevent slug / id overwrite
    delete body.slug;
    delete body._id;

    if (body.dateTime) body.dateTime = new Date(body.dateTime);

    const updated = await EventModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    ).lean();

    if (!updated) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    return NextResponse.json({ event: updated });
  } catch (err) {
    console.error('[PUT /api/events/[id]]', err);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// DELETE /api/events/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    await EventModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[DELETE /api/events/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
