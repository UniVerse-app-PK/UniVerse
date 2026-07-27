'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EventCard from '@/components/EventCard';
import { getToken, getUser, isAdmin } from '@/lib/auth';
import { fetchEvents, deleteEvent } from '@/lib/events';
import EventForm from '@/components/EventForm';
import BannerAd from '@/components/BannerAd';

const tabs = ['All', 'Internships', 'Research', 'Courses', 'Societies'];
const formCategories = ['Internships', 'Research', 'Courses', 'Societies', 'Other'];

export default function EventsPage() {
  const router = useRouter();
  const [active, setActive] = useState('All');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [me, setMe] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(false);

  useEffect(() => {
    setMe(getUser());
    setIsAdminUser(isAdmin());
  }, []);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchEvents(active)
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [active]);

  function handleAddEventClick() {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    setShowForm((v) => !v);
  }



  async function handleDelete(id) {
    if (!window.confirm('Delete this event?')) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold">Events</h1>
        {isAdminUser && (
          <button onClick={handleAddEventClick} className="px-4 py-2 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium">
            {showForm ? 'Cancel' : '+ Add event'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="mb-6 max-w-lg">
          <EventForm 
            onSuccess={async () => {
              setShowForm(false);
              const data = await fetchEvents(active);
              setEvents(data);
            }} 
            onCancel={() => setShowForm(false)} 
          />
        </div>
      )}

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

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-sm text-[#8A86A3]">Loading events...</p>}
    

      {!loading && (
  <div className="flex gap-6 items-start">

    {/* Events */}
    <div className="flex-1 space-y-3 max-w-2xl">
      {events.map((ev) => (
        <EventCard
          key={ev.id}
          event={ev}
          onDelete={ev.createdBy === me?.id ? () => handleDelete(ev.id) : null}
        />
      ))}

      {events.length === 0 && (
        <p className="text-sm text-[#8A86A3]">
          No events in this category yet.
        </p>
      )}
    </div>

    {/* Right Sidebar Advertisement */}
    <BannerAd orientation="vertical" />
  </div>
)}
    </div>
  );
}
