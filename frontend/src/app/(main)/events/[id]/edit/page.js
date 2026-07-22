'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchEventById } from '@/lib/events';
import { getUser } from '@/lib/auth';
import EventForm from '@/components/EventForm';

export default function EditEventPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const me = getUser();

  useEffect(() => {
    let cancelled = false;
    fetchEventById(resolvedParams.id)
      .then((data) => {
        if (!cancelled) setEvent(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [resolvedParams.id]);

  if (loading) return <div className="p-8 text-sm text-[#8A86A3]">Loading event...</div>;

  if (error || !event) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-500">{error || 'Event not found.'}</p>
        <Link href="/events" className="text-sm text-[#6C5CE7] font-medium mt-4 inline-block">Back to events</Link>
      </div>
    );
  }

  if (!me || String(event.createdBy) !== String(me.id)) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-500">You are not authorized to edit this event.</p>
        <Link href={`/events/${resolvedParams.id}`} className="text-sm text-[#6C5CE7] font-medium mt-4 inline-block">Back to event</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link href={`/events/${resolvedParams.id}`} className="inline-flex items-center gap-2 text-sm text-[#8A86A3] font-medium mb-6 hover:text-[#6C5CE7] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Event
      </Link>
      <h1 className="text-2xl font-bold text-[#1E1B2E] mb-6">Edit Event</h1>
      <EventForm 
        initialData={event} 
        onSuccess={() => router.push(`/events/${resolvedParams.id}`)} 
        onCancel={() => router.push(`/events/${resolvedParams.id}`)}
      />
    </div>
  );
}
