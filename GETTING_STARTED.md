# Event Invitation Web App - Getting Started

Welcome to EventInvite! A modern, beautiful web application for creating and managing digital event invitations.

## Features

✨ **Create Beautiful Invitations**
- Support for Weddings, Engagements, and Katb Ketab events
- Custom cover images
- Personal messages to guests
- Elegant, responsive design

📊 **Manage RSVPs**
- Track guest responses in real-time
- View guest lists with attendance counts
- Export and share invitation data

🔗 **Share Easily**
- Generate unique shareable links for each event
- QR codes for quick sharing
- Embedded Google Maps for venue locations

⏱️ **Event Countdown**
- Live countdown timer on invitations
- Shows days, hours, minutes, and seconds

## Quick Start

### 1. Access the App

- **Home Page**: `/` - Overview and navigation
- **Demo Invitation**: `/invite/demo-wedding-abcd1234` - See a sample invitation

### 2. Admin Dashboard

1. Go to the **Admin Login** page (`/login`)
2. Enter the demo password: **`admin123`**
3. You'll be taken to the dashboard where you can:
   - View all your events
   - Create new events
   - Manage guest lists
   - View QR codes and shareable links

### 3. Create an Event

1. Click **"Create Event"** on the dashboard
2. Fill in the event details:
   - **Event Title**: e.g., "Sarah & John's Wedding"
   - **Event Type**: Choose Wedding, Engagement, or Katb Ketab
   - **Host Name**: Your name
   - **Date & Time**: When the event is happening
   - **Location**: Venue address (used for Google Maps)
   - **Custom Message**: Personal message to guests
   - **Cover Image**: Upload a beautiful photo (optional)
3. Click **"Create Event"**
4. You'll be redirected to the dashboard where your new event appears

### 4. Share Your Invitation

Once an event is created:
1. Click **"View"** to see event details
2. Copy the invitation link and share it with guests
3. Or scan the QR code to share directly
4. Guests can visit the link and RSVP

### 5. Track RSVPs

- In the event details page, view:
  - Total number of RSVPs
  - Guest list with names and attendance counts
  - RSVP dates
  - Total attendee count

## Data Storage

All data is stored in your browser's **localStorage**. This means:
- ✅ No signup or account creation needed
- ✅ Data persists across browser sessions
- ⚠️ Clearing browser cache will delete all data
- ⚠️ Data is not synced across different browsers/devices

## Architecture

### Pages

- **`/`** - Home page with navigation
- **`/login`** - Admin login
- **`/dashboard`** - Event management dashboard (protected)
- **`/dashboard/create`** - Create new event form (protected)
- **`/dashboard/events/[id]`** - Event details and guest list (protected)
- **`/invite/[slug]`** - Public invitation page (shareable)

### Components

- **EventForm** - Reusable form for creating/editing events
- **RSVPForm** - Guest RSVP form
- **CountdownTimer** - Live countdown to event date
- **LocationMap** - Google Maps embed for venue
- **ProtectedRoute** - Route protection wrapper for admin pages

### State Management

- **React Context** (`lib/context/app-context.tsx`) for global state
- **localStorage** for persistence
- **Base64 encoding** for images

## Customization

### Change Admin Password

Edit `/app/login/page.tsx` and change the `DEMO_PASSWORD` constant:

```typescript
const DEMO_PASSWORD = 'your-new-password';
```

### Modify Event Types

Edit `/lib/context/app-context.tsx` and update the Event interface:

```typescript
type: 'Wedding' | 'Engagement' | 'Katb Ketab' | 'Your New Type';
```

### Change Colors

Edit `/app/globals.css` to modify the design tokens:

```css
:root {
  --primary: oklch(...);
  /* more tokens... */
}
```

## Demo Event

A demo wedding invitation is pre-loaded to show you what the app can do:

- **URL**: `/invite/demo-wedding-abcd1234`
- **Title**: "Sarah & John's Wedding"
- **Date**: 30 days from today
- **Sample Guests**: Alice Johnson (2 attendees), Bob Smith (1 attendee)

You can delete this event from the dashboard, or use it as a template.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- All modern mobile browsers

## Tips

💡 **Best Practices**:
1. Use high-quality cover images (1200x600px works best)
2. Keep event titles concise but descriptive
3. Include specific location details for Google Maps
4. Share the invitation link early to get RSVPs in advance
5. Check the guest list regularly to plan accordingly

💡 **Sharing Tips**:
- Use the QR code for in-person events or printed materials
- Copy and share the link via messaging apps, email, or social media
- The invitation page is mobile-friendly - guests can view it on any device

## Support

For issues or questions:
1. Check that you're using a modern browser
2. Try clearing your browser cache (this will delete all data)
3. Make sure localStorage is enabled in your browser

## Privacy

- No data is sent to external servers (except Google Maps for venue display)
- All guest information stays in your browser
- QR codes are generated client-side

Enjoy creating beautiful event invitations! 🎉
