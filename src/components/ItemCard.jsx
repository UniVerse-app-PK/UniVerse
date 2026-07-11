import Link from 'next/link';

export default function ItemCard({ item }) {
  return (
    <Link
      href={`/marketplace/${item.id}`}
      className="group rounded-2xl border border-[#EEEDFB] bg-white overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(108,92,231,0.10)]"
    >
      <div className="h-32 bg-[#F4F3FE] flex items-center justify-center text-[#CECBF6] text-xs">
        image
      </div>
      <div className="p-3">
        <p className="text-sm font-medium truncate">{item.name}</p>
        <p className="text-sm text-[#6C5CE7] font-semibold mt-0.5">{item.price}</p>
        <p className="text-xs text-[#B3AFC9] mt-0.5">{item.location}</p>
      </div>
    </Link>
  );
}
