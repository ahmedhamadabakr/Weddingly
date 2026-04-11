'use client';

interface LocationMapProps {
  location: string;
}

export function LocationMap({ location }: LocationMapProps) {
  const encodedLocation = encodeURIComponent(location);

  return (
    <div className="w-full">
      <div className="bg-gray-200 rounded-lg overflow-hidden h-96">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          // يفضل استخدام متغير بيئة لمفتاح الـ API
          src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBu-ZmVxPIV5bzh0Mg5gILfA8blQxWJ6tI'}&q=${encodedLocation}`}
        >
        </iframe>
      </div>
      <p className="text-sm text-gray-600 mt-4 text-center">📍 {location}</p>
    </div>
  );
}
