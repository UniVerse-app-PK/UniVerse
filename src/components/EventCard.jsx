export default function EventCard({ event }) {
  return (
    <div className="rounded-xl border border-[#EEEDFB] p-4 hover:bg-[#FAFAFC]">
      <p className="font-medium text-sm">{event.title}</p>
      <p className="text-xs text-[#8A86A3] mt-1">{event.meta}{event.org ? ` · ${event.org}` : ''}</p>
    </div>
  );
}
