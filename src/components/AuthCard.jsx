export default function AuthCard({ children }) {
  return (
    <div className="w-full max-w-sm bg-white border border-[#EEEDFB] rounded-2xl p-8">
      <div className="flex items-center gap-2 mb-6 justify-center">
        <div className="w-9 h-9 rounded-xl bg-[#6C5CE7] flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M22 10L12 5 2 10l10 5 10-5z" />
            <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
          </svg>
        </div>
        <span className="font-semibold text-xl text-[#6C5CE7]">
          Uni<span className="text-[#1E1B2E]">Verse</span>
        </span>
      </div>
      {children}
    </div>
  );
}
