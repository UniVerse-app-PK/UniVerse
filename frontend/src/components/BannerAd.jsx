import Image from "next/image";

export default function BannerAd() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-[#EEEDFB] bg-white shadow-md">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#F8F7FF] border-b border-[#EEEDFB]">

        <span className="text-xs font-semibold uppercase tracking-wide text-[#6C5CE7]">
          Sponsored
        </span>

        <button className="rounded-full bg-[#6C5CE7] px-4 py-2 text-sm font-medium text-white hover:bg-[#5849d6] transition">
          Claim Offer
        </button>

      </div>

      {/* Advertisement Image */}
      <Image
        src="/ads/foofoo.avif"
        alt="Sponsored Advertisement"
        width={1600}
        height={350}
        className="w-full h-auto object-cover"
        priority
      />

      {/* Footer */}
      <div className="px-5 py-4">
        <h3 className="text-lg font-semibold text-[#1F1B3A]">
          Student Exclusive Deals 🎓
        </h3>

        <p className="mt-1 text-sm text-[#6B6880]">
          Enjoy exclusive discounts from businesses partnered with UniVerse.
        </p>
      </div>

    </div>
  );
}