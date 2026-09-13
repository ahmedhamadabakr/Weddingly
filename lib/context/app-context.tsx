'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  numAttendees: number;
  timestamp: Date;
}

export interface EventTheme {
  primary: string;
  secondary: string;
  name?: string;
}

export interface Event {
  id: string;
  _id?: string;
  title: string;
  type: 'Wedding' | 'Engagement' | 'Katb Ketab';
  hostName: string;
  dateTime: Date;
  location: string;
  message: string;
  coverImage: string;       // Cloudinary URL
  slug: string;
  passcode: string;         // Event passcode / login password
  guests: Guest[];
  createdAt: Date;
  views: number;
  uniqueViewers: string[];
  musicTrack?: string;
  customMusicUrl?: string;  // Cloudinary URL for custom audio
  googleMapsUrl?: string;   // Direct Google Maps link
  theme?: EventTheme;
}

interface AppContextType {
  events: Event[];
  currentUser: { isAuthenticated: boolean };
  authorizedEventIds: string[];
  isGlobalAdmin: boolean;
  isLoading: boolean;
  createEvent: (event: Omit<Event, 'id' | '_id' | 'slug' | 'guests' | 'createdAt'>) => Promise<Event>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEvent: (id: string) => Event | undefined;
  getEventBySlug: (slug: string) => Event | undefined;
  addGuest: (eventId: string, guest: Omit<Guest, 'id' | 'eventId' | 'timestamp'>) => Promise<void>;
  getGuests: (eventId: string) => Guest[];
  trackInvitationView: (eventId: string, guestName: string) => Promise<void>;
  uploadFile: (file: File, type: 'image' | 'audio') => Promise<string>;
  refreshEvents: () => Promise<void>;
  login: () => void;
  loginWithEventPasscode: (passcode: string) => { success: boolean; eventId?: string; isGlobalAdmin?: boolean; error?: string };
  isEventAuthorized: (eventId: string) => boolean;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

/** Map raw API event (MongoDB doc) to our Event interface */
function mapEvent(raw: any): Event {
  return {
    ...raw,
    id:        raw._id ?? raw.id,
    dateTime:  new Date(raw.dateTime),
    createdAt: new Date(raw.createdAt),
    passcode:  raw.passcode ?? '',
    guests: (raw.guests ?? []).map((g: any) => ({
      ...g,
      eventId:   raw._id ?? raw.id,
      timestamp: new Date(g.timestamp),
    })),
    views:          raw.views          ?? 0,
    uniqueViewers:  raw.uniqueViewers  ?? [],
    musicTrack:     raw.musicTrack     ?? 'arabic-vibes',
    customMusicUrl: raw.customMusicUrl ?? '',
    googleMapsUrl:  raw.googleMapsUrl  ?? raw.locationUrl ?? raw.mapUrl ?? '',
    theme:          raw.theme          ?? { primary: '#e8627a', secondary: '#7c3aed' },
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents]                   = useState<Event[]>([]);
  const [currentUser, setCurrentUser]         = useState<{ isAuthenticated: boolean }>({ isAuthenticated: false });
  const [authorizedEventIds, setAuthorizedEventIds] = useState<string[]>([]);
  const [isGlobalAdmin, setIsGlobalAdmin]     = useState(false);
  const [isLoading, setIsLoading]             = useState(true);

  // ─── Load auth state from localStorage (lightweight) ───
  useEffect(() => {
    const auth = localStorage.getItem('weddingly_auth');
    const globalAdmin = localStorage.getItem('weddingly_global_admin') === 'true';
    const savedEventAuths = localStorage.getItem('weddingly_event_auths');
    
    let parsedEventAuths: string[] = [];
    if (savedEventAuths) {
      try { parsedEventAuths = JSON.parse(savedEventAuths); } catch (e) {}
    }

    if (auth === 'true' || globalAdmin || parsedEventAuths.length > 0) {
      setCurrentUser({ isAuthenticated: true });
      setIsGlobalAdmin(globalAdmin);
      setAuthorizedEventIds(parsedEventAuths);
      document.cookie = 'weddingly_auth=true; path=/; max-age=86400; SameSite=Lax';
    }
  }, []);

  // ─── Fetch events from MongoDB ───
  const refreshEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/events');
      if (!res.ok) throw new Error('Failed to load events');
      const { events: raw } = await res.json();
      setEvents(raw.map(mapEvent));
    } catch (err) {
      console.error('refreshEvents:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refreshEvents(); }, [refreshEvents]);

  // ─── CRUD ───
  const createEvent = async (
    eventData: Omit<Event, 'id' | '_id' | 'slug' | 'guests' | 'createdAt'>
  ): Promise<Event> => {
    const res = await fetch('/api/events', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(eventData),
    });
    if (!res.ok) throw new Error('Failed to create event');
    const { event } = await res.json();
    const mapped = mapEvent(event);
    setEvents((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateEvent = async (id: string, eventData: Partial<Event>): Promise<void> => {
    const res = await fetch(`/api/events/${id}`, {
      method:  'PUT',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(eventData),
    });
    if (!res.ok) throw new Error('Failed to update event');
    const { event } = await res.json();
    const mapped = mapEvent(event);
    setEvents((prev) => prev.map((e) => (e.id === id ? mapped : e)));
  };

  const deleteEvent = async (id: string): Promise<void> => {
    const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete event');
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const getEvent       = (id: string)      => events.find((e) => String(e.id) === String(id) || String(e._id) === String(id));
  const getGuests      = (eventId: string) => events.find((e) => String(e.id) === String(eventId) || String(e._id) === String(eventId))?.guests ?? [];
  const getEventBySlug = (slug: string)    => events.find((e) => e.slug === slug);

  const addGuest = async (
    eventId: string,
    guestData: Omit<Guest, 'id' | 'eventId' | 'timestamp'>
  ): Promise<void> => {
    const res = await fetch('/api/guests', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ eventId, ...guestData }),
    });
    if (!res.ok) throw new Error('Failed to add guest');
    // Refresh to get latest guests list
    await refreshEvents();
  };

  const trackInvitationView = async (eventId: string, guestName: string): Promise<void> => {
    await fetch(`/api/events/${eventId}/view`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ guestName }),
    });
    // Optimistic local update
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, views: e.views + 1, uniqueViewers: [...e.uniqueViewers, `${guestName}-${Date.now()}`] }
          : e
      )
    );
  };

  // ─── Cloudinary Upload ───
  const uploadFile = async (file: File, type: 'image' | 'audio'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? 'Upload failed');
    }
    const { url } = await res.json();
    return url as string;
  };

  // ─── Auth ───
  const login = () => {
    setCurrentUser({ isAuthenticated: true });
    setIsGlobalAdmin(true);
    localStorage.setItem('weddingly_auth', 'true');
    localStorage.setItem('weddingly_global_admin', 'true');
    document.cookie = 'weddingly_auth=true; path=/; max-age=86400; SameSite=Lax';
  };

  const loginWithEventPasscode = (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return { success: false, error: 'من فضلك أدخل رمز أو كلمة سر الدعوة' };

    // Check if global admin password
    const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (trimmed === adminPass) {
      login();
      return { success: true, isGlobalAdmin: true };
    }

    // Match against event passcodes
    const matched = events.find((e) => e.passcode && e.passcode.trim() === trimmed);
    if (matched) {
      const updatedAuths = Array.from(new Set([...authorizedEventIds, matched.id]));
      setAuthorizedEventIds(updatedAuths);
      setCurrentUser({ isAuthenticated: true });
      localStorage.setItem('weddingly_auth', 'true');
      localStorage.setItem('weddingly_event_auths', JSON.stringify(updatedAuths));
      document.cookie = 'weddingly_auth=true; path=/; max-age=86400; SameSite=Lax';
      return { success: true, eventId: matched.id };
    }

    return { success: false, error: 'رمز الدخول غير صحيح. تحقق من كلمة السر وحاول مجدداً.' };
  };

  const isEventAuthorized = (eventId: string): boolean => {
    if (isGlobalAdmin) return true;
    return authorizedEventIds.includes(eventId) || authorizedEventIds.includes(String(eventId));
  };

  const logout = () => {
    setCurrentUser({ isAuthenticated: false });
    setIsGlobalAdmin(false);
    setAuthorizedEventIds([]);
    localStorage.removeItem('weddingly_auth');
    localStorage.removeItem('weddingly_global_admin');
    localStorage.removeItem('weddingly_event_auths');
    document.cookie = 'weddingly_auth=; path=/; max-age=0; SameSite=Lax';
  };

  return (
    <AppContext.Provider
      value={{
        events,
        currentUser,
        authorizedEventIds,
        isGlobalAdmin,
        isLoading,
        createEvent,
        updateEvent,
        deleteEvent,
        getEvent,
        getEventBySlug,
        addGuest,
        getGuests,
        trackInvitationView,
        uploadFile,
        refreshEvents,
        login,
        loginWithEventPasscode,
        isEventAuthorized,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
