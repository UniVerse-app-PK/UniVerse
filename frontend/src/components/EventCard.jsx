import Link from 'next/link';

export default function EventCard({ event, onDelete }) {
  return (
    <Link href={`/events/${event.id}`} className="block rounded-xl border border-[#EEEDFB] p-4 hover:bg-[#FAFAFC] transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {event.photo ? (
            <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-[#EEEDFB]">
              <img src={event.photo} alt={event.title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-16 h-16 shrink-0 rounded-lg bg-[#EEEDFB] flex items-center justify-center text-[#B3AFC9]">
              <span className="text-xl">📅</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-[#1A1926] truncate">{event.title}</p>
            {event.description && (
              <p className="text-xs text-[#8A86A3] mt-0.5 line-clamp-1">{event.description}</p>
            )}
            <p className="text-xs text-[#8A86A3] mt-1 font-medium">{event.meta}{event.org ? ` · ${event.org}` : ''}</p>
          </div>
        </div>
        {onDelete && (
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} 
            className="text-xs text-red-500 font-medium shrink-0 hover:underline px-2 py-1 -mr-2"
          >
            Delete
          </button>
        )}
      </div>
    </Link>
  );
}
