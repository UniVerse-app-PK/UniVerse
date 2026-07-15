import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#EEEDFB] flex items-center justify-center text-[#6C5CE7] font-semibold text-lg">F4</div>
        <div>
          <h1 className="text-xl font-semibold">Foundry_4</h1>
          <p className="text-sm text-[#8A86A3]">BS Bioinformatics · NUST, Islamabad</p>
          <p className="text-sm text-[#0F6E56] font-medium mt-0.5">★ 4.7 (45 reviews)</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl bg-[#F4F3FE] p-4 text-center">
          <p className="text-2xl font-semibold text-[#6C5CE7]">12</p>
          <p className="text-sm text-[#8A86A3]">Listings</p>
        </div>
        <div className="rounded-xl bg-[#F4F3FE] p-4 text-center">
          <p className="text-2xl font-semibold text-[#6C5CE7]">24</p>
          <p className="text-sm text-[#8A86A3]">Reviews</p>
        </div>
      </div>
      <div className="border border-[#EEEDFB] rounded-2xl divide-y divide-[#EEEDFB]">
        <Link href="/marketplace/listings" className="flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-[#FAFAFC]">My listings <span className="text-[#B3AFC9]">&rsaquo;</span></Link>
        <Link href="/marketplace/saved" className="flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-[#FAFAFC]">Saved items <span className="text-[#B3AFC9]">&rsaquo;</span></Link>
        <Link href="/profile/reviews" className="flex items-center justify-between px-5 py-3.5 text-sm font-medium hover:bg-[#FAFAFC]">My reviews <span className="text-[#B3AFC9]">&rsaquo;</span></Link>
      </div>
    </div>
  );
}
