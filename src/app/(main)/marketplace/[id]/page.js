import Link from 'next/link';
import { notFound } from 'next/navigation';
import { listings } from '@/data/marketplaceData';

export default function ItemDetailPage({ params }) {
  const item = listings.find((l) => l.id === params.id);
  if (!item) return notFound();

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/marketplace" className="text-sm text-[#8A86A3] font-medium mb-4 inline-block">&larr; Back to market</Link>
      <div className="flex gap-8 flex-col sm:flex-row">
        <div className="w-full sm:w-72 h-72 rounded-2xl bg-[#EEEDFB] shrink-0 flex items-center justify-center text-[#6C5CE7] font-semibold text-sm text-center px-4">
          {item.name}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold mb-1">{item.name}</h1>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-semibold text-[#6C5CE7]">{item.price}</span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#E1F5EE] text-[#0F6E56]">{item.condition}</span>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-5 text-sm">
            <div><p className="text-[#B3AFC9]">Category</p><p className="font-medium mt-0.5">{item.category}</p></div>
            <div><p className="text-[#B3AFC9]">Seller</p><p className="font-medium mt-0.5">{item.seller}</p></div>
            <div><p className="text-[#B3AFC9]">Location</p><p className="font-medium mt-0.5">{item.location}</p></div>
          </div>
          <p className="text-sm text-[#8A86A3] mb-6">{item.description}</p>
          <div className="flex gap-3">
            <Link href="/chats" className="px-5 py-2.5 rounded-xl border border-[#6C5CE7] text-[#6C5CE7] text-sm font-medium hover:bg-[#F4F3FE]">Chat</Link>
            <button className="px-5 py-2.5 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium">Call</button>
          </div>
        </div>
      </div>
    </div>
  );
}
