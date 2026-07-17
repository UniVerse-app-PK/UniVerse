'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PrivacySecurityPage() {
  const [settings, setSettings] = useState({
    twoFactor: false,
    WhatsAppcontact: true,
    personalizedAds: true,
    emailNotifications: true,
    pushNotifications: false,
  });

  function toggleSetting(name) {
    setSettings({
      ...settings,
      [name]: !settings[name],
    });
  }

  return (
    <div className="p-8 max-w-xl">

      <h1 className="text-2xl font-semibold mb-6">
        Privacy & Security
      </h1>

      <div className="border border-[#EEEDFB] rounded-2xl divide-y divide-[#EEEDFB]">

        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Two-Factor Authentication</p>
            <p className="text-sm text-[#8A86A3]">
              Add an extra layer of security.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.twoFactor}
            onChange={() => toggleSetting('twoFactor')}
          />
        </div>

        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Contact via WhatsApp</p>
            <p className="text-sm text-[#8A86A3]">
              Allow other students to contact you via WhatsApp instead of call.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.WhatsAppcontact}
            onChange={() => toggleSetting('WhatsAppcontact')}
          />
        </div>

        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Personalized ads</p>
            <p className="text-sm text-[#8A86A3]">
              See targeted advertisements based on your interests.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.personalizedAds}
            onChange={() => toggleSetting('personalizedAds')}
          />
        </div>

        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Email Notifications</p>
            <p className="text-sm text-[#8A86A3]">
              Receive updates via email.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.emailNotifications}
            onChange={() => toggleSetting('emailNotifications')}
          />
        </div>

        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Push Notifications</p>
            <p className="text-sm text-[#8A86A3]">
              Receive instant app notifications.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.pushNotifications}
            onChange={() => toggleSetting('pushNotifications')}
          />
        </div>

      </div>
      <div className="flex gap-3 mt-8">

        <button
          onClick={() => alert('Privacy settings saved!')}
          className="bg-[#6C5CE7] text-white px-6 py-3 rounded-xl font-medium"
        >
          Save Settings
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