import ItemCard from '@/components/ItemCard';
import { listings } from '@/data/marketplaceData';

const savedIds = ['4', '7', '8'];

export default function SavedItemsPage() {
  const saved = listings.filter((l) => savedIds.includes(l.id));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-5">Saved items</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {saved.map((item) => <ItemCard key={item.id} item={item} />)}
      </div>
    </div>
  );
}
