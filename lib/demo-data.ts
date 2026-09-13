import { Event } from '@/lib/context/app-context';

export const DEMO_EVENT: Omit<Event, 'id' | 'createdAt' | 'guests'> = {
  title: "Sarah & John's Wedding",
  type: 'Wedding',
  hostName: 'Sarah & John',
  dateTime: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  location: 'Grand Hotel, Cairo',
  googleMapsUrl: '',
  message: 'We are thrilled to invite you to celebrate our special day!',
  slug: 'demo-wedding-abcd1234',
  coverImage: '',
  passcode: '1234',
  views: 0,
  uniqueViewers: [],
};
