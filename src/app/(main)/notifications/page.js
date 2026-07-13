import { notifications } from '@/data/notificationsData';

export default function NotificationsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-5">Notifications</h1>
      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className="rounded-xl border border-[#EEEDFB] p-4 flex items-center justify-between hover:bg-[#FAFAFC]">
            <p className="text-sm font-medium">{n.text}</p>
            <span className="text-xs text-[#B3AFC9] shrink-0 ml-4">{n.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
