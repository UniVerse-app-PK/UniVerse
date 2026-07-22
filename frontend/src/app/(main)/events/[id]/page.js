'use client';

import Link from 'next/link';
import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchEventById, deleteEvent } from '@/lib/events';
import { getUser } from '@/lib/auth';

export default function EventDetailPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!window.confirm('Delete this event? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await deleteEvent(event.id);
      router.push('/events');
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-sm text-[#8A86A3]">Loading event...</div>;
  }

  if (error || !event) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-500">{error || 'Event not found.'}</p>
        <Link href="/events" className="text-sm text-[#6C5CE7] font-medium mt-4 inline-block">Back to events</Link>
      </div>
    );
  }

  const currentUserId = getUser()?.id;
  const isOwner = !!(event.createdBy && currentUserId && String(event.createdBy) === String(currentUserId));

  return (
    <div className="p-6 max-w-5xl mx-auto pb-16">
      <Link href="/events" className="inline-flex items-center gap-2 text-sm text-[#8A86A3] font-medium mb-6 hover:text-[#6C5CE7] transition-colors">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to events
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-6 space-y-4">
          <div className="relative aspect-square rounded-3xl bg-white overflow-hidden border border-[#EEEDFB] shadow-sm flex items-center justify-center">
            {event.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={event.photo}
                alt={event.title}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#CECBF6]">
                <span className="text-6xl">📅</span>
                <span className="font-semibold text-lg">No Poster</span>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-6 space-y-6 bg-white p-6 rounded-3xl border border-[#EEEDFB] shadow-sm">
          <div>
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[#F4F3FE] text-[#6C5CE7] uppercase tracking-wider">
              {event.category}
            </span>
            <h1 className="text-3xl font-bold text-[#1E1B2E] mt-3">{event.title}</h1>
          </div>

          <div className="space-y-4 py-4 border-y border-[#EEEDFB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEEDFB] flex items-center justify-center text-[#6C5CE7] shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <p className="text-xs text-[#8A86A3] font-medium">Organization / Society</p>
                <p className="font-semibold text-[#1E1B2E]">{event.org || 'Not specified'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEEDFB] flex items-center justify-center text-[#6C5CE7] shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <div>
                <p className="text-xs text-[#8A86A3] font-medium">Date / Deadline</p>
                <p className="font-semibold text-[#1E1B2E]">{event.meta || 'TBA'}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[#1E1B2E] mb-2">About this event</h3>
            {event.description ? (
              <p className="text-sm text-[#8A86A3] leading-relaxed whitespace-pre-wrap">{event.description}</p>
            ) : (
              <p className="text-sm text-[#CECBF6] italic">No description provided.</p>
            )}
            
            <div className="flex flex-wrap gap-3 mt-5">
              {event.url && (
                <a
                  href={event.url.startsWith('http') ? event.url : `https://${event.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-[#6C5CE7] text-[#6C5CE7] text-sm font-semibold hover:bg-[#F4F3FE] transition-all"
                >
                  More Info
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              )}
              
              {event.applicationUrl && (
                <a
                  href={event.applicationUrl.startsWith('http') ? event.applicationUrl : `https://${event.applicationUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-semibold hover:bg-[#5b4cc4] transition-all"
                >
                  Apply Now
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              )}

              {event.whatsapp && (
                <a
                  href={event.whatsapp.startsWith('http') ? event.whatsapp : `https://wa.me/${event.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:bg-[#20bd5a] transition-all"
                >
                  WhatsApp Contact
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {isOwner && (
            <div className="pt-4 border-t border-[#EEEDFB] flex gap-3">
              <Link
                href={`/events/${event.id}/edit`}
                className="flex-1 text-center py-3 px-6 rounded-xl border border-[#EEEDFB] text-[#1E1B2E] font-semibold hover:bg-[#FAFAFC] active:scale-[0.98] transition-all text-sm"
              >
                Edit Event
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 px-6 rounded-xl bg-red-50 text-red-500 font-semibold hover:bg-red-100 active:scale-[0.98] transition-all text-sm disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete Event'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
