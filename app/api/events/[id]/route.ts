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

async function generateUniqueSlug(title: string, excludeId?: string): Promise<string> {
  const sanitized = title
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FF\u0750-\u077Fa-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'invite';

  let candidateSlug = sanitized;
  let counter = 1;

  while (true) {
    const existing = await EventModel.findOne({ slug: candidateSlug }).lean();
    if (!existing || (excludeId && String(existing._id) === String(excludeId))) {
      break;
    }
    counter++;
    candidateSlug = `${sanitized}-${counter}`;
  }

  return candidateSlug;
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

    // Clean up or regenerate slug if title is present
    if (body.title) {
      body.slug = await generateUniqueSlug(body.title, id);
    } else {
      delete body.slug;
    }
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
