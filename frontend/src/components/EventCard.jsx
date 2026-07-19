export default function EventCard({ event, onDelete }) {
  return (
    <div className="rounded-xl border border-[#EEEDFB] p-4 hover:bg-[#FAFAFC] flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="font-medium text-sm">{event.title}</p>
        <p className="text-xs text-[#8A86A3] mt-1">{event.meta}{event.org ? ` · ${event.org}` : ''}</p>
      </div>
      {onDelete && (
        <button onClick={onDelete} className="text-xs text-red-500 font-medium shrink-0 hover:underline">
          Delete
        </button>
      )}
    </div>
  );
}
