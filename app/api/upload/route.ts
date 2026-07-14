import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name:  process.env.CLOUDINARY_CLOUD_NAME!,
  api_key:     process.env.CLOUDINARY_API_KEY!,
  api_secret:  process.env.CLOUDINARY_API_SECRET!,
});

// POST /api/upload
// Body: FormData with field "file" (image or audio) and optional "type" ("image" | "audio")
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const uploadType = (formData.get('type') as string) ?? 'image';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload options depending on file type
    const uploadOptions: Record<string, any> =
      uploadType === 'audio'
        ? {
            resource_type: 'video', // Cloudinary uses "video" for audio files
            folder: 'weddingly/audio',
            allowed_formats: ['mp3', 'wav', 'ogg', 'm4a', 'aac'],
          }
        : {
            resource_type: 'image',
            folder: 'weddingly/images',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
            transformation: [
              { width: 1400, height: 700, crop: 'fill', quality: 'auto', fetch_format: 'auto' },
            ],
          };

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions);

    return NextResponse.json({
      url:       result.secure_url,
      publicId:  result.public_id,
      format:    result.format,
      duration:  result.duration ?? null,  // for audio
    });
  } catch (err: any) {
    console.error('[POST /api/upload]', err);
    return NextResponse.json({ error: err.message ?? 'Upload failed' }, { status: 500 });
  }
}
