'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SellForm from '@/components/SellForm';
import { getToken } from '@/lib/auth';

export default function SellPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) {
    return <div className="p-8 text-sm text-[#8A86A3]">Loading...</div>;
  }

  return (
    <div className="p-8">
      <SellForm />
    </div>
  );
}
