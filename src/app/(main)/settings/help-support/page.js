'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    question: 'What is UniVerse?',
    answer:
      'UniVerse is a campus platform built for university students. You can buy and sell items in the marketplace, discover campus events and many more features to help you connect with your campus community.',
  },
  {
    question: 'How do I set up my profile?',
    answer:
      'Head to Settings → Edit Profile. You can add a profile photo, update your name, address and contact details so other students can contact you regarding your listings.',
  },
  {
    question: 'How do I list an item on the marketplace?',
    answer:
      'Go to the Marketplace page and tap the "Sell an item" button. Fill in the item title, description, price, and upload photos. Once you publish it, other students on campus can see and contact you about it.',
  },
  {
    question: 'How do I contact a seller or buyer?',
    answer:
      'Open the listing you are interested in and you can either call or start a conversation by tapping the chat button. All your recent chats are accessible from the Chats section in the sidebar.',
  },
  {
    question: 'How do events work?',
    answer:
      'The Events page shows upcoming campus events. You can browse event details, dates, and locations. Keep an eye on the events section for activities posted by student organizations, departments and clubs.',
  },
  {
    question: 'How do I change my password?',
    answer:
      'Go to Settings → Change Password. Enter your current password, then set a new one. We recommend using at least 8 characters with a mix of letters, numbers, and special characters.',
  },
  {
    question: 'How do notifications work?',
    answer:
      'You will receive notifications for new messages, marketplace activity, and event updates. You can manage email and push notification preferences in Settings → Privacy & Security.',
  },
  {
    question: 'Can I report another user?',
    answer:
      'Yes. If you encounter inappropriate behaviour, use the report option on their profile or listing.',
  },
  {
    question: 'What are premium perks and how do I access them?',
    answer:
      'Premium perks are optional and exclusive features available to users who have subscribed to our premium plan. There are different packages with varying benefits. You can learn more about them from the Premium perks section in the sidebar.',
  },
  {
    question: 'Who do I contact if I need more help?',
    answer:
      'If your question is not answered here, you can reach out to our support team at support@universe-app.com. We typically respond within 24 hours.',
  },
];

export default function HelpSupportPage() {
  const [openIndex, setOpenIndex] = useState(null);

  function toggleFaq(index) {
    setOpenIndex(openIndex === index ? null : index);
  }

  return (
    <div className="p-8 max-w-xl">

      <h1 className="text-2xl font-semibold mb-6">
        Help &amp; Support
      </h1>

      <p className="text-sm text-[#8A86A3] mb-5">
        Find answers to the most common questions about using UniVerse.
      </p>

      <div className="border border-[#EEEDFB] rounded-2xl divide-y divide-[#EEEDFB]">
        {faqs.map((faq, index) => (
          <button
            key={index}
            onClick={() => toggleFaq(index)}
            className="w-full text-left px-5 py-4 hover:bg-[#FAFAFC] transition-colors"
          >
            <div className="flex items-center justify-between">
              <p className="font-medium text-sm pr-4">{faq.question}</p>
              <span
                className={`text-[#B3AFC9] text-lg flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-90' : ''
                }`}
              >
                &rsaquo;
              </span>
            </div>

            {openIndex === index && (
              <p className="text-sm text-[#8A86A3] mt-2 leading-relaxed">
                {faq.answer}
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <Link
          href="/settings"
          className="border border-[#EEEDFB] px-6 py-3 rounded-xl font-medium text-sm"
        >
          Back to Settings
        </Link>
      </div>

    </div>
  );
}
