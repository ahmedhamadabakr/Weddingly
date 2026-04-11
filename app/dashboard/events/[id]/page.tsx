'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppContext } from '@/lib/context/app-context';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import QRCode from "react-qr-code";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getEvent, deleteEvent } = useAppContext();
  const id = params.id as string;
  const event = getEvent(id);

  if (!event) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center">
          <Card className="p-8 text-center bg-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Not Found</h2>
            <p className="text-gray-600 mb-6">The event you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/dashboard">
              <Button>Back to Dashboard</Button>
            </Link>
          </Card>
        </main>
      </ProtectedRoute>
    );
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(event.id);
      router.push('/dashboard');
    }
  };

  const invitationUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/invite/${event.slug}`;
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalAttendees = event.guests.reduce((sum, guest) => sum + guest.numAttendees, 0);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 animate-fadeIn">
        <nav className="flex justify-between items-center p-6 bg-white shadow-sm animate-slideInDown">
          <h1 className="text-2xl font-bold text-gray-800">Event Details</h1>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </nav>

        <div className="p-8 max-w-6xl mx-auto space-y-8">
          {/* Event Info */}
          <Card className="p-8 bg-white animate-slideInUp stagger-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{event.title}</h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Event Type</p>
                    <p className="text-lg font-semibold text-gray-900">{event.type}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Host</p>
                    <p className="text-lg font-semibold text-gray-900">{event.hostName}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="text-lg font-semibold text-gray-900">{formatDate(event.dateTime)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-lg font-semibold text-gray-900">{event.location}</p>
                  </div>
                </div>
              </div>

              <div>
                {event.coverImage && (
                  <div className="mb-6">
                    <img src={event.coverImage} alt={event.title} className="w-full h-auto rounded-lg shadow-md" />
                  </div>
                )}
              </div>
            </div>

            {event.message && (
              <div className="mt-8 p-4 bg-pink-50 rounded-lg border border-pink-200">
                <p className="text-sm text-gray-600 mb-2">Message to Guests</p>
                <p className="text-gray-800">{event.message}</p>
              </div>
            )}
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-white animate-slideInLeft stagger-2">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Invitation Views</h3>
              <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
                {event.views}
              </p>
              <p className="text-sm text-gray-600">Total invitation page views</p>
            </Card>
            <Card className="p-8 bg-white animate-slideInRight stagger-2">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Engagement</h3>
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{event.guests.length}</p>
                  <p className="text-xs text-gray-600">RSVPs</p>
                </div>
                <div className="text-gray-400">→</div>
                <div>
                  <p className="text-3xl font-bold text-green-600">{event.views > 0 ? ((event.guests.length / event.views) * 100).toFixed(1) : '0'}%</p>
                  <p className="text-xs text-gray-600">Conversion</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sharing & QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 bg-white animate-slideInLeft stagger-3">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Shareable Link</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Invitation URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={invitationUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(invitationUrl);
                        alert('Link copied to clipboard!');
                      }}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <Link href={`/invite/${event.slug}`} target="_blank">
                  <Button variant="outline" className="w-full">
                    Preview Invitation
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="p-8 bg-white flex flex-col items-center justify-center animate-slideInRight stagger-3">
              <h3 className="text-xl font-bold text-gray-900 mb-4 w-full">QR Code</h3>
              <div className="p-4 bg-gray-50 rounded-lg hover:scale-110 transition-transform duration-300">
                <QRCode value={invitationUrl} size={200} />
              </div>
              <p className="text-sm text-gray-600 mt-4 text-center">Scan to view invitation</p>
            </Card>
          </div>

          {/* Guest List */}
          <Card className="p-8 bg-white animate-slideInUp stagger-4">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Guest List</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-blue-50 rounded-lg hover:shadow-lg transition-shadow hover:scale-105 duration-300 animate-slideInUp stagger-1">
                <p className="text-sm text-gray-600">Total RSVPs</p>
                <p className="text-3xl font-bold text-blue-600">{event.guests.length}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg hover:shadow-lg transition-shadow hover:scale-105 duration-300 animate-slideInUp stagger-2">
                <p className="text-sm text-gray-600">Total Attendees</p>
                <p className="text-3xl font-bold text-green-600">{totalAttendees}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg hover:shadow-lg transition-shadow hover:scale-105 duration-300 animate-slideInUp stagger-3">
                <p className="text-sm text-gray-600">Avg per Guest</p>
                <p className="text-3xl font-bold text-purple-600">
                  {event.guests.length > 0 ? (totalAttendees / event.guests.length).toFixed(1) : '0'}
                </p>
              </div>
            </div>

            {event.guests.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No RSVPs yet. Share the invitation link to start collecting responses!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Guest Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Attendees</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">RSVP Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.guests.map((guest) => (
                      <tr key={guest.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{guest.name}</td>
                        <td className="py-3 px-4 text-gray-900">{guest.numAttendees}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {new Date(guest.timestamp).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href={`/dashboard/create?edit=${event.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                Edit Event
              </Button>
            </Link>
            <Button variant="destructive" onClick={handleDelete} className="flex-1">
              Delete Event
            </Button>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
