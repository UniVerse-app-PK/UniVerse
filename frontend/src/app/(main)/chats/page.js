import { Suspense } from 'react';
import ChatApp from '@/components/ChatApp';

export default function ChatsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-[#8A86A3]">Loading chats...</div>}>
      <ChatApp />
    </Suspense>
  );
}
