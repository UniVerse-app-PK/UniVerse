import Image from "next/image";

export default function BannerAd() {
  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-md border border-[#EEEDFB]">
      <Image
        src="/ads/foofoo.avif"
        alt="Sponsored Advertisement"
        width={1600}
        height={350}
        className="w-full h-auto object-cover"
        priority
      />
    </div>
  );
}