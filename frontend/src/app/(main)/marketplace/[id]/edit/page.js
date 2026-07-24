'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SellForm from '@/components/SellForm';
import { fetchListingById } from '@/lib/listings';
import { getToken, getUser } from '@/lib/auth';

export default function EditListingPage({ params }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }

    let cancelled = false;
    fetchListingById(resolvedParams.id)
      .then((data) => {
        if (cancelled) return;
        const me = getUser();
        if (data.sellerId !== (me?.id || me?._id)) {
          setError("You can only edit your own listings.");
          return;
        }
        setItem(data);
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
  }, [resolvedParams.id, router]);

  if (loading) {
    return <div className="p-8 text-sm text-[#8A86A3]">Loading listing...</div>;
  }

  if (error || !item) {
    return (
      <div className="p-8">
        <p className="text-sm text-red-500">{error || 'Listing not found.'}</p>
        <Link href="/marketplace/listings" className="text-sm text-[#6C5CE7] font-medium">Back to my listings</Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <SellForm editId={item.id} initialData={item} />
    </div>
  );
}
