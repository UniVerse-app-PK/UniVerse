import { redirect } from 'next/navigation';

export default async function ChatRedirectPage({ params }) {
  const { id } = await params;
  redirect(`/chats?chatId=${id}`);
}
