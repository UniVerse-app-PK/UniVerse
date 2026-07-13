import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen max-w-[1440px] mx-auto flex flex-col">
      <Navbar />
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
