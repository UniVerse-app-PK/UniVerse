'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LanguagePage() {
  const [language, setLanguage] = useState('English');

  return (
    <div className="p-8 max-w-xl">

      <h1 className="text-2xl font-semibold mb-6">
        Language
      </h1>

      <div className="border border-[#EEEDFB] rounded-2xl p-5 space-y-5">

        <p className="text-sm text-[#8A86A3]">
          Choose your preferred language for the UniVerse app.
        </p>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="language"
            value="English"
            checked={language === 'English'}
            onChange={(e) => setLanguage(e.target.value)}
          />
          <span>🇬🇧 English</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            name="language"
            value="Urdu"
            checked={language === 'Urdu'}
            onChange={(e) => setLanguage(e.target.value)}
          />
          <span>🇵🇰 Urdu</span>
        </label>

      </div>

      <div className="flex gap-3 mt-8">

        <button
          onClick={() =>
            alert(`Language changed to ${language}!`)
          }
          className="bg-[#6C5CE7] text-white px-6 py-3 rounded-xl font-medium"
        >
          Save Language
        </button>

        <Link
          href="/settings"
          className="border border-[#EEEDFB] px-6 py-3 rounded-xl font-medium"
        >
          Cancel
        </Link>

      </div>

    </div>
  );
}