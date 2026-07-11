export default function AboutPage() {
  return (
    <div className="p-8 max-w-md text-center mx-auto flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-14 h-14 rounded-2xl bg-[#6C5CE7] flex items-center justify-center mb-4">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <path d="M22 10L12 5 2 10l10 5 10-5z" />
          <path d="M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" />
        </svg>
      </div>
      <h1 className="text-xl font-semibold text-[#6C5CE7]">UniVerse</h1>
      <p className="text-sm text-[#8A86A3] mt-1">V 1.0.0</p>
      <p className="text-sm text-[#8A86A3] mt-4">A trusted marketplace and student ecosystem built for university students.</p>
      <p className="text-xs text-[#B3AFC9] mt-6">© 2026 Foundry_4 Team</p>
    </div>
  );
}
