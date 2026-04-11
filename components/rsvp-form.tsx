'use client';

import { useState } from 'react';
import { useAppContext } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface RSVPFormProps {
  eventId: string;
  onSubmit?: () => void;
}

export function RSVPForm({ eventId, onSubmit }: RSVPFormProps) {
  const { addGuest } = useAppContext();
  const [name, setName] = useState('');
  const [numAttendees, setNumAttendees] = useState('1');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsSubmitting(true);

    // التأكد من أن عدد الحضور بين 1 و 10 كما هو محدد في الواجهة
    const parsedCount = parseInt(numAttendees);
    const attendeeCount = Math.min(10, Math.max(1, parsedCount || 1));

    setTimeout(() => {
      addGuest(eventId, {
        name: name.trim(),
        numAttendees: attendeeCount,
      });

      setName('');
      setNumAttendees('1');
      setIsSubmitting(false);
      setSubmitted(true);
      onSubmit?.();

      // Reset success message after 4 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 4000);
    }, 600);
  };

  if (submitted) {
    return (
      <Card className="p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 animate-slideInUp">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce-sm">✨</div>
          <h3 className="text-2xl font-bold text-green-900 mb-2 animate-slideInDown">Thank You!</h3>
          <p className="text-green-700 animate-fadeIn">Your RSVP has been received. We look forward to seeing you!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 bg-white animate-slideInUp">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 animate-fadeIn">RSVP for This Event</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="animate-fadeIn stagger-1">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            disabled={isSubmitting}
            className="w-full border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors disabled:opacity-50 py-2 rounded-lg"
          />
        </div>

        <div className="animate-fadeIn stagger-2">
          <label htmlFor="attendees" className="block text-sm font-medium text-gray-700 mb-2">
            Number of Attendees
          </label>
          <Input
            id="attendees"
            type="number"
            value={numAttendees}
            onChange={(e) => setNumAttendees(e.target.value)}
            disabled={isSubmitting}
            min="1"
            max="10"
            className="w-full border-2 border-pink-200 focus:border-pink-500 focus:outline-none transition-colors disabled:opacity-50 py-2 rounded-lg"
          />
          <p className="text-xs text-gray-500 mt-1">Including yourself</p>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-lg animate-slideInDown">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          disabled={!name.trim() || isSubmitting}
          className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 h-12 text-lg font-bold rounded-lg transition-all hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 animate-fadeIn stagger-3"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            'Confirm RSVP'
          )}
        </Button>
      </form>

      <p className="text-xs text-gray-500 text-center mt-4">
        Your information will be shared with the event organizer
      </p>
    </Card>
  );
}
