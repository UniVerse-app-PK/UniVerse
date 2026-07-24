import { api } from './api';
import { getUser } from './auth';

// Picks the "other" participant to display as the chat name/avatar
function getOtherParticipant(chat) {
  const me = getUser();
  const others = (chat.participants || []).filter((p) => p._id !== (me?.id || me?._id));
  return others[0] || chat.participants?.[0];
}

export function mapChat(chat) {
  const other = getOtherParticipant(chat);
  return {
    id: chat._id,
    name: other?.name || 'Unknown user',
    avatar: other?.avatar || '',
    listing: chat.listing || null,
    lastMessage: chat.lastMessage || '',
    time: chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    otherUserId: other?._id || null,
  };
}

export async function fetchMyChats() {
  const data = await api.get('/chats', { auth: true });
  return data.chats.map(mapChat);
}

export async function fetchMessages(chatId) {
  const data = await api.get(`/chats/${chatId}/messages`, { auth: true });
  const me = getUser();
  return data.messages.map((m) => ({
    id: m._id,
    from: m.sender?._id === (me?.id || me?._id) ? 'me' : 'them',
    text: m.text,
    time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }));
}

export async function sendChatMessage(chatId, text) {
  const data = await api.post(`/chats/${chatId}/messages`, { text }, { auth: true });
  return data.message;
}

export async function deleteChat(chatId) {
  return api.delete(`/chats/${chatId}`, { auth: true });
}

export async function clearChat(chatId) {
  return api.delete(`/chats/${chatId}/messages`, { auth: true });
}

// Starts (or resumes) a chat with another user, optionally tied to a listing
export async function startChat(userId, listingId) {
  const data = await api.post('/chats', { userId, listingId }, { auth: true });
  return mapChat(data.chat);
}
