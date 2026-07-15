'use client';

import { useState } from 'react';
import { chats as initialChats } from '@/data/chatsData';

export default function ChatApp() {
  const [chats, setChats] = useState(initialChats);
  const [activeId, setActiveId] = useState(initialChats[0]?.id);
  const [draft, setDraft] = useState('');

  const active = chats.find((c) => c.id === activeId);

  function sendMessage(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    setChats((prev) => prev.map((c) => (
      c.id === activeId
        ? { ...c, messages: [...c.messages, { from: 'me', text: draft }], lastMessage: draft, time: 'now' }
        : c
    )));
    setDraft('');
  }

  return (
    <div className="flex h-[calc(100vh-110px)]">
      <div className="w-80 border-r border-[#EEEDFB] p-5 overflow-y-auto shrink-0">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
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
        </div>
      </div>

      {active ? (
        <div className="flex-1 flex flex-col">
          <div className="px-6 py-4 border-b border-[#EEEDFB] flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#EEEDFB] flex items-center justify-center text-[#6C5CE7] font-semibold text-xs">{active.name.slice(0, 2).toUpperCase()}</div>
            <span className="font-medium">{active.name}</span>
          </div>
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">
            {active.messages.map((m, i) => (
              <div key={i} className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${m.from === 'me' ? 'bg-[#6C5CE7] text-white rounded-br-sm ml-auto' : 'bg-[#F4F3FE] rounded-bl-sm'}`}>{m.text}</div>
            ))}
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
