import './globals.css';

export const metadata = {
  title: 'UniVerse',
  description: 'Everything you need, all in your university.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAFC] text-[#1E1B2E]">{children}</body>
    </html>
  );
}
