'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead
} from '@/lib/notifications';
import BannerAd from '@/components/BannerAd';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }

    fetchNotifications()
      .then(setNotifications)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleMarkAllRead() {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleClick(n) {
    if (n.read) return;

    try {
      await markNotificationRead(n.id);

      setNotifications((prev) =>
        prev.map((x) =>
          x.id === n.id
            ? { ...x, read: true }
            : x
        )
      );
    } catch {
      // Ignore
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="p-8 text-sm text-[#8A86A3]">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-semibold">
          Notifications
        </h1>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm font-medium text-[#6C5CE7]"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-4">
          {error}
        </p>
      )}

      <div className="flex gap-6 items-start">

        {/* Notifications */}
        <div className="flex-1 max-w-2xl space-y-2">

          {notifications.map((n) => {
            const card = (
              <div
                className={`rounded-xl border p-4 flex items-center justify-between hover:bg-[#FAFAFC] cursor-pointer ${
                  n.read
                    ? 'border-[#EEEDFB]'
                    : 'border-[#6C5CE7] bg-[#F4F3FE]'
                }`}
              >
                <p className="text-sm font-medium">
                  {n.text}
                </p>

                <span className="text-xs text-[#B3AFC9] ml-4 shrink-0">
                  {n.time}
                </span>
              </div>
            );

            return n.link ? (
              <Link
                key={n.id}
                href={n.link}
                onClick={() => handleClick(n)}
              >
                {card}
              </Link>
            ) : (
              <div
                key={n.id}
                onClick={() => handleClick(n)}
              >
                {card}
              </div>
            );
          })}

          {notifications.length === 0 && (
            <p className="text-sm text-[#8A86A3]">
              No notifications yet.
            </p>
          )}

        </div>

        {/* Advertisement Sidebar */}
        <div className="hidden lg:block shrink-0">
          <BannerAd orientation="vertical" />
        </div>  
      </div>

    </div>
  );
}