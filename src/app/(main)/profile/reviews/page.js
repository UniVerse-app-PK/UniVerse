export default function ReviewsPage() {
  const reviews = [
    { reviewer: 'Amarah', rating: 5, text: 'Great seller, item exactly as described.' },
    { reviewer: 'Kavindu', rating: 4, text: 'Good communication, quick meetup.' },
    { reviewer: 'Namra', rating: 5, text: 'Smooth transaction, would buy again.' },
  ];

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-5">My reviews</h1>
      <div className="space-y-3">
        {reviews.map((r, i) => (
          <div key={i} className="rounded-xl border border-[#EEEDFB] p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium">{r.reviewer}</p>
              <span className="text-xs text-[#0F6E56] font-medium">{'★'.repeat(r.rating)}</span>
            </div>
            <p className="text-sm text-[#8A86A3]">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
