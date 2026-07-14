import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGuest {
  id: string;
  name: string;
  numAttendees: number;
  timestamp: Date;
}

export interface IEvent extends Document {
  title: string;
  type: 'Wedding' | 'Engagement' | 'Katb Ketab';
  hostName: string;
  dateTime: Date;
  location: string;
  message: string;
  coverImage: string;      // Cloudinary URL
  slug: string;
  guests: IGuest[];
  createdAt: Date;
  views: number;
  uniqueViewers: string[];
  musicTrack?: string;     // track id from library OR cloudinary URL for custom upload
  customMusicUrl?: string; // Cloudinary URL for custom uploaded audio
  theme?: {
    primary: string;
    secondary: string;
    name?: string;
  };
}

const GuestSchema = new Schema<IGuest>({
  id:           { type: String, required: true },
  name:         { type: String, required: true },
  numAttendees: { type: Number, required: true, min: 1 },
  timestamp:    { type: Date, default: Date.now },
});

const EventSchema = new Schema<IEvent>(
  {
    title:         { type: String, required: true },
    type:          { type: String, enum: ['Wedding', 'Engagement', 'Katb Ketab'], required: true },
    hostName:      { type: String, required: true },
    dateTime:      { type: Date, required: true },
    location:      { type: String, required: true },
    message:       { type: String, default: '' },
    coverImage:    { type: String, default: '' },
    slug:          { type: String, required: true, unique: true },
    guests:        { type: [GuestSchema], default: [] },
    views:         { type: Number, default: 0 },
    uniqueViewers: { type: [String], default: [] },
    musicTrack:    { type: String, default: 'arabic-vibes' },
    customMusicUrl:{ type: String, default: '' },
    theme: {
      primary:   { type: String, default: '#e8627a' },
      secondary: { type: String, default: '#7c3aed' },
      name:      { type: String },
    },
  },
  { timestamps: true }
);

// Prevent model re-compilation in Next.js hot reload
const EventModel: Model<IEvent> =
  mongoose.models.Event ?? mongoose.model<IEvent>('Event', EventSchema);

export default EventModel;
