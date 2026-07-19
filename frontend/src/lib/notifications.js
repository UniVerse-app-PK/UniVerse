import { api } from './api';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function mapNotification(n) {
  return {
    id: n._id,
    text: n.text,
    time: timeAgo(n.createdAt),
    read: n.read,
    link: n.link || '',
    type: n.type,
  };
}

export async function fetchNotifications() {
  const data = await api.get('/notifications', { auth: true });
  return data.notifications.map(mapNotification);
}

export async function markNotificationRead(id) {
  return api.put(`/notifications/${id}/read`, {}, { auth: true });
}

export async function markAllNotificationsRead() {
  return api.put('/notifications/read-all', {}, { auth: true });
}
