'use client';

import { useState } from 'react';
import EventCard from '@/components/EventCard';
import { events } from '@/data/eventsData';

const tabs = ['All', 'Internships', 'Research', 'Courses', 'Societies'];

export default function EventsPage() {
  const [active, setActive] = useState('All');
  const filtered = active === 'All' ? events : events.filter((e) => e.category === active);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-5">Events</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActive(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${
              active === t ? 'bg-[#6C5CE7] text-white' : 'border border-[#EEEDFB] hover:bg-[#F4F3FE]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="space-y-3 max-w-2xl">
        {filtered.map((e) => <EventCard key={e.id} event={e} />)}
        {filtered.length === 0 && <p className="text-sm text-[#8A86A3]">No events in this category yet.</p>}
      </div>
    </div>
  );
}
