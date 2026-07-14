'use client';

import { useState } from 'react';
import { useAppContext, Event, EventTheme } from '@/lib/context/app-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageIcon, Music, Loader2, Upload, CheckCircle2, X } from 'lucide-react';

interface EventFormProps {
  initialEvent?: Event;
  onSubmit?: (event: Event) => void;
  defaultValues?: {
    theme?: EventTheme;
    musicTrack?: string;
  };
}

const formatDateTimeForInput = (date: Date | string) => {
  const d = new Date(date);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
};

export function EventForm({ initialEvent, onSubmit, defaultValues }: EventFormProps) {
  const { createEvent, updateEvent, uploadFile } = useAppContext();

  const [formData, setFormData] = useState({
    title:          initialEvent?.title      || '',
    type:           (initialEvent?.type      || 'Wedding') as 'Wedding' | 'Engagement' | 'Katb Ketab',
    hostName:       initialEvent?.hostName   || '',
    dateTime:       initialEvent ? formatDateTimeForInput(initialEvent.dateTime) : '',
    location:       initialEvent?.location   || '',
    message:        initialEvent?.message    || '',
    coverImage:     initialEvent?.coverImage || '',
    customMusicUrl: initialEvent?.customMusicUrl || '',
  });

  const [imagePreview,     setImagePreview]     = useState<string>(initialEvent?.coverImage || '');
  const [imageUploading,   setImageUploading]   = useState(false);
  const [audioUploading,   setAudioUploading]   = useState(false);
  const [audioFileName,    setAudioFileName]    = useState<string>('');
  const [error,            setError]            = useState('');
  const [isSubmitting,     setIsSubmitting]     = useState(false);

  const theme      = defaultValues?.theme;
  const musicTrack = defaultValues?.musicTrack ?? initialEvent?.musicTrack ?? 'arabic-vibes';

  // ─── Image Upload → Cloudinary ───
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    setImageUploading(true);
    setError('');
    try {
      const url = await uploadFile(file, 'image');
      setFormData((prev) => ({ ...prev, coverImage: url }));
      setImagePreview(url);
    } catch (err: any) {
      setError('فشل رفع الصورة: ' + (err.message ?? 'خطأ غير معروف'));
      setImagePreview('');
    } finally {
      setImageUploading(false);
    }
  };

  // ─── Audio Upload → Cloudinary ───
  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAudioFileName(file.name);
    setAudioUploading(true);
    setError('');
    try {
      const url = await uploadFile(file, 'audio');
      setFormData((prev) => ({ ...prev, customMusicUrl: url }));
    } catch (err: any) {
      setError('فشل رفع الصوت: ' + (err.message ?? 'خطأ غير معروف'));
      setAudioFileName('');
    } finally {
      setAudioUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.hostName || !formData.dateTime || !formData.location) {
      setError('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    if (imageUploading || audioUploading) {
      setError('يرجى الانتظار حتى اكتمال الرفع');
      return;
    }

    setIsSubmitting(true);

    const eventData = {
      title:          formData.title,
      type:           formData.type,
      hostName:       formData.hostName,
      dateTime:       new Date(formData.dateTime),
      location:       formData.location,
      message:        formData.message,
      coverImage:     formData.coverImage,
      customMusicUrl: formData.customMusicUrl,
      views:          initialEvent?.views        ?? 0,
      uniqueViewers:  initialEvent?.uniqueViewers ?? [],
      musicTrack,
      theme: theme ?? { primary: '#e8627a', secondary: '#f43f5e' },
    };

    try {
      if (initialEvent) {
        await updateEvent(initialEvent.id, eventData);
        onSubmit?.({ ...initialEvent, ...eventData } as Event);
      } else {
        const newEvent = await createEvent(eventData);
        onSubmit?.(newEvent);
      }
    } catch (err: any) {
      setError(err.message ?? 'حدث خطأ، يرجى المحاولة مجدداً');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldLabel = 'block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2';
  const inputClass = 'luxury-input w-full px-3 py-2.5 text-sm';

  return (
    <div className="luxury-card p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">
          {initialEvent ? 'تعديل الحدث ✏️' : 'تفاصيل الحدث 📋'}
        </h2>
        <p className="text-white/35 text-xs mt-1">أدخل بيانات الحدث لإنشاء رابط الدعوة</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Title */}
        <div>
          <label className={fieldLabel}>عنوان الحدث *</label>
          <input
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="مثال: زفاف سارة وأحمد"
            className={inputClass}
          />
        </div>

        {/* Type + Host */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={fieldLabel}>نوع الحدث *</label>
            <Select
              value={formData.type}
              onValueChange={(v) => setFormData({ ...formData, type: v as 'Wedding' | 'Engagement' | 'Katb Ketab' })}
            >
              <SelectTrigger className="luxury-input w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1220] border border-white/10 text-white">
                <SelectItem value="Wedding"    className="hover:bg-white/5 focus:bg-white/5">💍 زفاف</SelectItem>
                <SelectItem value="Engagement" className="hover:bg-white/5 focus:bg-white/5">💜 خطوبة</SelectItem>
                <SelectItem value="Katb Ketab" className="hover:bg-white/5 focus:bg-white/5">📜 كتب كتاب</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className={fieldLabel}>اسم المضيف *</label>
            <input
              value={formData.hostName}
              onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
              placeholder="اسمك أو اسم العائلة"
              className={inputClass}
            />
          </div>
        </div>

        {/* Date + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={fieldLabel}>التاريخ والوقت *</label>
            <input
              type="datetime-local"
              value={formData.dateTime}
              onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              className={inputClass}
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div>
            <label className={fieldLabel}>مكان الحفل *</label>
            <input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="مثال: فندق القاهرة الكبرى"
              className={inputClass}
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className={fieldLabel}>رسالة الدعوة</label>
          <textarea
            rows={3}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="اكتب رسالة ترحيبية للضيوف..."
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Cover Image → Cloudinary */}
        <div>
          <label className={fieldLabel}>صورة الغلاف</label>
          <label className="flex items-center gap-3 cursor-pointer luxury-input px-3 py-3 hover:border-white/20 transition-colors group">
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
              {imageUploading
                ? <Loader2 className="w-4 h-4 text-rose-400 animate-spin" />
                : <ImageIcon className="w-4 h-4 text-white/50" />
              }
            </div>
            <span className="text-sm text-white/40">
              {imageUploading ? 'جاري الرفع إلى Cloudinary...' : 'اختر صورة (JPG, PNG, WebP)'}
            </span>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={imageUploading} />
          </label>

          {imagePreview && (
            <div className="mt-3 rounded-xl overflow-hidden border border-white/10 relative">
              <img src={imagePreview} alt="preview" className="w-full max-h-52 object-cover" />
              {imageUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 text-rose-400 animate-spin mx-auto mb-1" />
                    <p className="text-white text-xs">جاري الرفع...</p>
                  </div>
                </div>
              )}
              {!imageUploading && (
                <button
                  type="button"
                  onClick={() => { setFormData({ ...formData, coverImage: '' }); setImagePreview(''); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur text-white text-xs hover:bg-black/80 transition-colors flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Custom Audio Upload → Cloudinary */}
        <div>
          <label className={fieldLabel}>موسيقى مخصصة (اختياري)</label>
          <label className="flex items-center gap-3 cursor-pointer luxury-input px-3 py-3 hover:border-white/20 transition-colors group">
            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
              {audioUploading
                ? <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                : formData.customMusicUrl
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  : <Music className="w-4 h-4 text-white/50" />
              }
            </div>
            <span className="text-sm text-white/40 truncate max-w-[200px]">
              {audioUploading
                ? 'جاري رفع الصوت...'
                : formData.customMusicUrl
                  ? (audioFileName || 'تم رفع الصوت ✅')
                  : 'ارفع ملف صوتي (MP3, WAV, AAC)'
              }
            </span>
            <input type="file" accept="audio/*" onChange={handleAudioUpload} className="hidden" disabled={audioUploading} />
          </label>
          {formData.customMusicUrl && !audioUploading && (
            <div className="mt-2 flex items-center gap-2">
              <audio controls src={formData.customMusicUrl} className="flex-1 h-8" />
              <button
                type="button"
                onClick={() => { setFormData({ ...formData, customMusicUrl: '' }); setAudioFileName(''); }}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5 text-white/50" />
              </button>
            </div>
          )}
          <p className="text-white/25 text-xs mt-1.5">
            إذا تركته فارغاً، سيُستخدم المقطع المحدد من مكتبة الموسيقى
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || imageUploading || audioUploading}
          className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60"
          style={{
            background: theme
              ? `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`
              : 'linear-gradient(135deg, #e8627a, #f43f5e)',
            boxShadow: '0 4px 20px rgba(232, 98, 122, 0.25)',
          }}
        >
          {isSubmitting
            ? <><Loader2 className="w-4 h-4 animate-spin" /> جاري الحفظ...</>
            : initialEvent ? 'حفظ التعديلات ✅' : 'إنشاء الدعوة 🚀'
          }
        </button>
      </form>
    </div>
  );
}