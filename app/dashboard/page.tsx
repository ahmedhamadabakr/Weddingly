'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context/app-context';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function DashboardPage() {
  const router = useRouter();
  const { events, deleteEvent, logout } = useAppContext();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 animate-fadeIn">
        <nav className="flex justify-between items-center p-6 bg-white shadow-sm animate-slideInDown">
          <h1 className="text-2xl font-bold text-gray-800">EventInvite Dashboard</h1>
          <div className="flex gap-4">
            <Link href="/dashboard/create">
              <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 hover:scale-105 transition-transform">
                + Create Event
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </nav>

        <div className="p-8 max-w-7xl mx-auto">
          <div className="mb-8 animate-slideInUp">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Events</h2>
            <p className="text-gray-600">Manage and track all your event invitations</p>
          </div>

          {/* Statistics Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-white animate-slideInLeft stagger-1">
              <p className="text-sm text-gray-600 mb-2">Total Events</p>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">{events.length}</p>
              <p className="text-xs text-gray-500 mt-2">Active invitations</p>
            </Card>
            <Card className="p-6 bg-white animate-slideInUp stagger-2">
              <p className="text-sm text-gray-600 mb-2">Total RSVPs</p>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
                {events.reduce((sum, e) => sum + e.guests.length, 0)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Confirmed attendees</p>
            </Card>
            <Card className="p-6 bg-white animate-slideInRight stagger-3">
              <p className="text-sm text-gray-600 mb-2">Total Views</p>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                {events.reduce((sum, e) => sum + e.views, 0)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Invitation clicks</p>
            </Card>
          </div>

          {events.length === 0 ? (
            <Card className="p-12 text-center bg-white animate-slideInUp">
              <div className="text-6xl mb-4 animate-bounce-sm">📭</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
              <p className="text-gray-600 mb-6">Create your first event invitation to get started!</p>
              <Link href="/dashboard/create">
                <Button className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 hover:scale-105 transition-transform">
                  Create Your First Event
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, idx) => (
                <Card 
                  key={event.id} 
                  className={`overflow-hidden bg-white hover:shadow-xl transition-all hover:scale-105 animate-slideInUp stagger-${(idx % 5) + 1}`}
                >
                  {event.coverImage && (
                    <div className="w-full h-48 overflow-hidden bg-gray-200 relative">
                      <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                      <div className="absolute top-2 right-2 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {event.views} views
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Host:</span> {event.hostName}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Type:</span> {event.type}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      <span className="font-medium">Date:</span> {formatDate(event.dateTime)}
                    </p>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">RSVPs</p>
                        <p className="text-2xl font-bold text-blue-600">{event.guests.length}</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Views</p>
                        <p className="text-2xl font-bold text-purple-600">{event.views}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <Link href={`/dashboard/events/${event.id}`} className="flex-1">
                        <Button size="sm" variant="outline" className="w-full hover:scale-105 transition-transform">
                          View
                        </Button>
                      </Link>
                      <Link href={`/invite/${event.slug}`} target="_blank" className="flex-1">
                        <Button size="sm" variant="outline" className="w-full hover:scale-105 transition-transform">
                          Preview
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(event.id)}
                        className="flex-1 hover:scale-105 transition-transform"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}
