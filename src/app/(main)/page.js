import Link from 'next/link';
import ItemCard from '@/components/ItemCard';
import { user, categories } from '@/data/dashboardData';
import { listings } from '@/data/marketplaceData';

export default function HomePage() {
  const featuredItems = listings.slice(0, 4);
  const recentItems = listings.slice(4, 8);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Hello, {user.name} 👋</h1>
        <p className="text-[#8A86A3] text-sm mt-1">Have a nice day</p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        {categories.map((cat, i) => (
          <Link
            key={cat}
            href="/marketplace"
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              i === 0 ? 'bg-[#6C5CE7] text-white' : 'border border-[#EEEDFB] hover:bg-[#F4F3FE]'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Featured</h2>
        <Link href="/marketplace" className="text-sm text-[#6C5CE7] font-medium">See all</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {featuredItems.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Recently added</h2>
        <Link href="/marketplace" className="text-sm text-[#6C5CE7] font-medium">See all</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recentItems.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
