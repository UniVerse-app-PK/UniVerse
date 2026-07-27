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
<div className="w-64 shrink-0">

  <div className="sticky top-6 overflow-hidden rounded-2xl border border-[#EEEDFB] bg-white shadow-sm">

    <div className="flex items-center justify-between px-4 py-3 bg-[#F8F7FF] border-b border-[#EEEDFB]">

      <span className="text-xs font-semibold uppercase tracking-wide text-[#6C5CE7]">
        Sponsored
      </span>

      <button className="rounded-full bg-[#6C5CE7] px-3 py-1 text-xs font-medium text-white hover:bg-[#5849d6]">
        Claim
      </button>

    </div>

    <img
      src="/ads/foofoo.avif"
      alt="Sponsored Advertisement"
      className="w-full h-auto"
    />

    <div className="p-4">

      <h3 className="font-semibold text-[#1E1B2E]">
        Student Exclusive Deals
      </h3>

      <p className="mt-2 text-sm text-[#6B6880]">
        Save on food, shopping, and services with exclusive student offers through UniVerse partners.
      </p>

    </div>

  </div>

</div>

      </div>

    </div>
  );
}