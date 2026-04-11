'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  numAttendees: number;
  timestamp: Date;
}

export interface Event {
  id: string;
  title: string;
  type: 'Wedding' | 'Engagement' | 'Katb Ketab';
  hostName: string;
  dateTime: Date;
  location: string;
  message: string;
  coverImage: string;
  slug: string;
  guests: Guest[];
  createdAt: Date;
  views: number;
  uniqueViewers: string[];
}

export interface User {
  isAuthenticated: boolean;
}

interface AppContextType {
  events: Event[];
  currentUser: User;
  createEvent: (event: Omit<Event, 'id' | 'slug' | 'guests' | 'createdAt'>) => Event;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  getEvent: (id: string) => Event | undefined;
  getEventBySlug: (slug: string) => Event | undefined;
  addGuest: (eventId: string, guest: Omit<Guest, 'id' | 'eventId' | 'timestamp'>) => void;
  getGuests: (eventId: string) => Guest[];
  trackInvitationView: (eventId: string, guestName: string) => void;
  login: () => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function generateSlug(title: string): string {
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const random = Math.random().toString(36).substring(2, 8);
  return `${sanitized}-${random}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentUser, setCurrentUser] = useState<User>({ isAuthenticated: false });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('app_state');
    if (stored) {
      try {
        const { events: storedEvents, userAuth } = JSON.parse(stored);
        // Convert dateTime and createdAt strings back to Date objects
        const parsedEvents = storedEvents.map((event: any) => ({
          ...event,
          dateTime: new Date(event.dateTime),
          createdAt: new Date(event.createdAt),
          guests: event.guests.map((guest: any) => ({
            ...guest,
            timestamp: new Date(guest.timestamp),
          })),
          // Ensure views and uniqueViewers exist (for backward compatibility with older events)
          views: event.views ?? 0,
          uniqueViewers: event.uniqueViewers ?? [],
        }));
        setEvents(parsedEvents);
        setCurrentUser({ isAuthenticated: userAuth });
      } catch (error) {
        console.error('Failed to load app state:', error);
      }
    } else {
      // Initialize with demo event if no stored data
      const demoEvent: Event = {
        id: 'demo-001',
        title: "Sarah & John's Wedding",
        type: 'Wedding',
        hostName: 'Sarah & John',
        dateTime: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        location: 'Grand Hotel, Cairo',
        message: 'We are thrilled to invite you to celebrate our special day!',
        slug: 'demo-wedding-abcd1234',
        coverImage: '',
        guests: [
          {
            id: 'guest-1',
            eventId: 'demo-001',
            name: 'Alice Johnson',
            numAttendees: 2,
            timestamp: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'guest-2',
            eventId: 'demo-001',
            name: 'Bob Smith',
            numAttendees: 1,
            timestamp: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000),
          },
        ],
        createdAt: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        views: 0,
        uniqueViewers: [],
      };
      setEvents([demoEvent]);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(
        'app_state',
        JSON.stringify({
          events,
          userAuth: currentUser.isAuthenticated,
        })
      );
    }
  }, [events, currentUser, isHydrated]);

  const createEvent = (eventData: Omit<Event, 'id' | 'slug' | 'guests' | 'createdAt' | 'views' | 'uniqueViewers'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substring(2, 9),
      slug: generateSlug(eventData.title),
      guests: [],
      createdAt: new Date(),
      views: 0,
      uniqueViewers: [],
    };
    setEvents([...events, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, eventData: Partial<Event>) => {
    setEvents(
      events.map((event) =>
        event.id === id
          ? {
              ...event,
              ...eventData,
              id: event.id,
              slug: event.slug,
              createdAt: event.createdAt,
            }
          : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const getEvent = (id: string) => {
    return events.find((event) => event.id === id);
  };

  const getEventBySlug = (slug: string) => {
    return events.find((event) => event.slug === slug);
  };

  const addGuest = (eventId: string, guestData: Omit<Guest, 'id' | 'eventId' | 'timestamp'>) => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          const newGuest: Guest = {
            ...guestData,
            id: Math.random().toString(36).substring(2, 9),
            eventId,
            timestamp: new Date(),
          };
          return {
            ...event,
            guests: [...event.guests, newGuest],
          };
        }
        return event;
      })
    );
  };

  const getGuests = (eventId: string) => {
    const event = getEvent(eventId);
    return event ? event.guests : [];
  };

  const trackInvitationView = (eventId: string, guestName: string) => {
    setEvents(
      events.map((event) => {
        if (event.id === eventId) {
          const viewerId = `${guestName}-${new Date().getTime()}`;
          return {
            ...event,
            views: event.views + 1,
            uniqueViewers: [...event.uniqueViewers, viewerId],
          };
        }
        return event;
      })
    );
  };

  const login = () => {
    setCurrentUser({ isAuthenticated: true });
  };

  const logout = () => {
    setCurrentUser({ isAuthenticated: false });
  };

  return (
    <AppContext.Provider
      value={{
        events,
        currentUser,
        createEvent,
        updateEvent,
        deleteEvent,
        getEvent,
        getEventBySlug,
        addGuest,
        getGuests,
        trackInvitationView,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
