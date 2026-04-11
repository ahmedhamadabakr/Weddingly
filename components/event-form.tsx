'use client';

import { useState } from 'react';
import { useAppContext, Event } from '@/lib/context/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Theme {
  primary: string;
  secondary: string;
  name?: string;
}

interface EventFormProps {
  initialEvent?: Event;
  onSubmit?: (event: Event) => void;
  defaultValues?: {
    theme?: Theme;
  };
}

/**
 * دالة مساعدة لتنسيق التاريخ ليناسب مدخل datetime-local مع مراعاة التوقيت المحلي
 */
const formatDateTimeForInput = (date: Date | string) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
};

export function EventForm({ initialEvent, onSubmit, defaultValues }: EventFormProps) {
  const { createEvent, updateEvent } = useAppContext();

  const [formData, setFormData] = useState({
    title: initialEvent?.title || '',
    type: (initialEvent?.type || 'Wedding') as 'Wedding' | 'Engagement' | 'Katb Ketab',
    hostName: initialEvent?.hostName || '',
    dateTime: initialEvent ? formatDateTimeForInput(initialEvent.dateTime) : '',
    location: initialEvent?.location || '',
    message: initialEvent?.message || '',
    coverImage: initialEvent?.coverImage || '',
  });

  const [imagePreview, setImagePreview] = useState<string>(initialEvent?.coverImage || '');
  const [error, setError] = useState('');

  const theme = defaultValues?.theme;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData((prev) => ({ ...prev, coverImage: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.hostName || !formData.dateTime || !formData.location) {
      setError('Please fill all required fields');
      return;
    }

    const eventData = {
      title: formData.title,
      type: formData.type,
      hostName: formData.hostName,
      dateTime: new Date(formData.dateTime),
      location: formData.location,
      message: formData.message,
      coverImage: formData.coverImage,
      views: initialEvent?.views || 0,
      uniqueViewers: initialEvent?.uniqueViewers || 0,

      // إضافة القالب المختار أو القالب الافتراضي
      theme: theme || {
        primary: '#ff4d6d',
        secondary: '#7b2cbf',
      },
    };

    if (initialEvent) {
      updateEvent(initialEvent.id, eventData);
      onSubmit?.({ ...initialEvent, ...eventData } as Event);
    } else {
      const newEvent = createEvent(eventData);
      onSubmit?.(newEvent);
    }
  };

  return (
    <Card className="p-8 bg-white space-y-6">

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          {initialEvent ? 'Edit Event ✏️' : 'Create Your Invitation ✨'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Fill the details below to generate your invitation link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* TITLE */}
        <div>
          <label className="text-sm font-medium">Event Title *</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Sarah & Ahmed Wedding"
          />
        </div>

        {/* TYPE + HOST */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Event Type *</label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wedding">💍 Wedding</SelectItem>
                <SelectItem value="Engagement">💖 Engagement</SelectItem>
                <SelectItem value="Katb Ketab">📜 Katb Ketab</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Host Name *</label>
            <Input
              value={formData.hostName}
              onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
              placeholder="Your Name"
            />
          </div>
        </div>

        {/* DATE + LOCATION */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Date & Time *</label>
            <Input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Location *</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Grand Hotel, Cairo"
            />
          </div>
        </div>

        {/* MESSAGE */}
        <div>
          <label className="text-sm font-medium">Message</label>
          <Textarea
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Write a personal message for guests..."
          />
        </div>

        {/* IMAGE */}
        <div>
          <label className="text-sm font-medium">Cover Image</label>
          <Input type="file" accept="image/*" onChange={handleImageUpload} />

          {imagePreview && (
            <img
              src={imagePreview}
              className="mt-4 w-full max-h-60 object-cover rounded-xl border"
            />
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded">
            {error}
          </div>
        )}

        {/* SUBMIT */}
        <Button
          type="submit"
          className="w-full text-white font-semibold"
          style={{
            background: theme
              ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
              : undefined,
          }}
        >
          {initialEvent ? 'Update Event' : 'Generate Invitation 🚀'}
        </Button>
      </form>
    </Card>
  );
}