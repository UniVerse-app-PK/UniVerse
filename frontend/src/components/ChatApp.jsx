'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchMyChats, fetchMessages, sendChatMessage, startChat, deleteChat, clearChat } from '@/lib/chats';
import { getToken } from '@/lib/auth';

export default function ChatApp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const withUserId = searchParams.get('with');
  const listingId = searchParams.get('listing');

  const [chats, setChats] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const pollRef = useRef(null);

  const loadChats = useCallback(async () => {
    try {
      const data = await fetchMyChats();
      setChats(data);
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, []);

  // Initial load: create/open a chat if arriving from "Chat with Seller", or open specific chatId, else load list
  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }

    (async () => {
      setLoading(true);
      if (withUserId) {
        try {
          const chat = await startChat(withUserId, listingId || undefined);
          await loadChats();
          setActiveId(chat.id);
        } catch (err) {
          setError(err.message);
        }
      } else {
        const data = await loadChats();
        const chatIdParam = searchParams.get('chatId');
        if (chatIdParam && data.some((c) => c.id === chatIdParam)) {
          setActiveId(chatIdParam);
        } else if (chatIdParam) {
          setActiveId(chatIdParam);
        } else if (data[0]) {
          setActiveId(data[0].id);
        }
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load + poll messages for the active chat
  useEffect(() => {
    if (!activeId) return;

    let cancelled = false;

    async function load() {
      try {
        const data = await fetchMessages(activeId);
        if (!cancelled) setMessages(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      }
    }

    load();
    pollRef.current = setInterval(load, 4000);

    return () => {
      cancelled = true;
      clearInterval(pollRef.current);
    };
  }, [activeId]);

  const active = chats.find((c) => c.id === activeId);

  useEffect(() => {
    setMenuOpen(false);
  }, [activeId]);

  async function handleDeleteChat() {
    if (!activeId) return;
    if (!window.confirm('Delete this chat? This removes it for both people and cannot be undone.')) return;
    try {
      await deleteChat(activeId);
      const remaining = chats.filter((c) => c.id !== activeId);
      setChats(remaining);
      setMessages([]);
      setActiveId(remaining[0]?.id || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setMenuOpen(false);
    }
  }

  async function handleClearChat() {
    if (!activeId) return;
    if (!window.confirm('Clear all messages in this conversation?')) return;
    try {
      await clearChat(activeId);
      setMessages([]);
      loadChats();
    } catch (err) {
      setError(err.message);
    } finally {
      setMenuOpen(false);
    }
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!draft.trim() || !activeId) return;
    const text = draft;
    setDraft('');
    try {
      await sendChatMessage(activeId, text);
      const data = await fetchMessages(activeId);
      setMessages(data);
      loadChats();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) {
    return <div className="p-8 text-sm text-[#8A86A3]">Loading chats...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-110px)]">
      <div className="w-80 border-r border-[#EEEDFB] p-5 overflow-y-auto shrink-0">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
        <div className="space-y-1">
          {chats.map((c) => (
            <button key={c.id} onClick={() => setActiveId(c.id)} className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left ${c.id === activeId ? 'bg-[#F4F3FE]' : 'hover:bg-[#FAFAFC]'}`}>
              <div className="w-9 h-9 rounded-full bg-[#EEEDFB] flex items-center justify-center text-[#6C5CE7] font-semibold text-xs shrink-0">{c.name.slice(0, 2).toUpperCase()}</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-[#8A86A3] truncate">{c.lastMessage}</p>
              </div>
              <span className="text-xs text-[#B3AFC9] shrink-0">{c.time}</span>
            </button>
          ))}
          {chats.length === 0 && <p className="text-sm text-[#8A86A3]">No conversations yet.</p>}
        </div>
      </div>

      {active ? (
        <div className="flex-1 flex flex-col">
          <div className="px-6 py-4 border-b border-[#EEEDFB] flex items-center gap-3 relative">
            <div className="w-9 h-9 rounded-full bg-[#EEEDFB] flex items-center justify-center text-[#6C5CE7] font-semibold text-xs">{active.name.slice(0, 2).toUpperCase()}</div>
            <span className="font-medium flex-1">{active.name}</span>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8A86A3] hover:bg-[#F4F3FE]"
              title="Chat options"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
            </button>
            {menuOpen && (
              <div className="absolute right-6 top-14 w-52 bg-white border border-[#EEEDFB] rounded-xl shadow-lg py-1.5 z-10">
                <button onClick={handleClearChat} className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#F4F3FE]">Clear conversation</button>
                <button onClick={handleDeleteChat} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50">Delete chat</button>
              </div>
            )}
          </div>
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">
            {messages.map((m) => (
              <div key={m.id} className={`max-w-xs ${m.from === 'me' ? 'ml-auto' : ''}`}>
                <div className={`rounded-2xl px-4 py-2.5 text-sm ${m.from === 'me' ? 'bg-[#6C5CE7] text-white rounded-br-sm' : 'bg-[#F4F3FE] rounded-bl-sm'}`}>{m.text}</div>
                <p className={`text-[10px] text-[#B3AFC9] mt-1 ${m.from === 'me' ? 'text-right' : ''}`}>{m.time}</p>
              </div>
            ))}
            {messages.length === 0 && <p className="text-sm text-[#8A86A3]">Say hi 👋</p>}
          </div>
          <form onSubmit={sendMessage} className="p-4 border-t border-[#EEEDFB] flex gap-2">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message..." className="flex-1 px-4 py-2.5 rounded-xl border border-[#EEEDFB] bg-[#FAFAFC] text-sm focus:outline-none focus:border-[#6C5CE7]" />
            <button type="submit" className="w-10 h-10 rounded-xl bg-[#6C5CE7] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 2L11 13" /><path d="M22 2l-7 20-4-9-9-4z" /></svg>
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-[#8A86A3]">Select a chat to start messaging</div>
      )}
    </div>
  );
}
