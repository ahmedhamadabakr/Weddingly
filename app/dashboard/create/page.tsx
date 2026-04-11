'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { EventForm } from '@/components/event-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const themes = [
  {
    name: 'Romantic',
    primary: '#ff4d6d',
    secondary: '#ff8fa3',
  },
  {
    name: 'Luxury',
    primary: '#111827',
    secondary: '#7c3aed',
  },
  {
    name: 'Ocean',
    primary: '#0ea5e9',
    secondary: '#22c55e',
  },
  {
    name: 'Sunset',
    primary: '#f97316',
    secondary: '#ec4899',
  },
];

export default function CreateEventPage() {
  const router = useRouter();

  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  const handleSubmit = () => {
    router.push('/dashboard');
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">

        {/* NAV */}
        <nav className="flex justify-between items-center p-6 bg-white shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            Create Event ✨
          </h1>

          <Link href="/dashboard">
            <Button variant="outline">Back</Button>
          </Link>
        </nav>

        {/* CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 max-w-7xl mx-auto">

          {/* FORM */}
          <div className="lg:col-span-2 space-y-6">

            {/* THEME SELECTOR */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Choose Theme 🎨</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {themes.map((theme) => (
                  <motion.div
                    key={theme.name}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedTheme(theme)}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition ${
                      selectedTheme.name === theme.name
                        ? 'border-black'
                        : 'border-gray-200'
                    }`}
                  >
                    <div
                      className="h-10 rounded mb-2"
                      style={{
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                      }}
                    />
                    <p className="text-center text-sm font-medium">
                      {theme.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* FORM */}
            <Card className="p-6">
              <EventForm
                onSubmit={handleSubmit}
                defaultValues={{
                  theme: selectedTheme,
                }}
              />
            </Card>
          </div>

          {/* LIVE PREVIEW */}
          <div className="lg:col-span-1 sticky top-6">
            <Card className="p-6 h-[600px] overflow-hidden relative">

              <h2 className="text-lg font-semibold mb-4 text-center">
                Live Preview 👀
              </h2>

              <div
                className="h-full rounded-xl flex flex-col items-center justify-center text-white text-center p-6 transition-all duration-500"
                style={{
                  background: `linear-gradient(135deg, ${selectedTheme.primary}, ${selectedTheme.secondary})`,
                }}
              >
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold"
                >
                  Your Event Title
                </motion.h1>

                <p className="mt-2 text-white/80">
                  Hosted by You
                </p>

                <div className="mt-6 px-4 py-2 border border-white rounded-full text-sm">
                  Preview Invitation
                </div>
              </div>
            </Card>
          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}