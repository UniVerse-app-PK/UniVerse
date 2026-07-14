'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PrivacySecurityPage() {
  const [settings, setSettings] = useState({
    twoFactor: false,
    profilePublic: true,
    allowMessages: true,
    emailNotifications: true,
    pushNotifications: false,
    locationSharing: false,
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
            <p className="font-medium">Public Profile</p>
            <p className="text-sm text-[#8A86A3]">
              Allow other students to view your profile.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.profilePublic}
            onChange={() => toggleSetting('profilePublic')}
          />
        </div>

        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Allow Messages</p>
            <p className="text-sm text-[#8A86A3]">
              Let users contact you.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.allowMessages}
            onChange={() => toggleSetting('allowMessages')}
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

        <div className="flex items-center justify-between p-4">
          <div>
            <p className="font-medium">Location Sharing</p>
            <p className="text-sm text-[#8A86A3]">
              Share your city with buyers and sellers.
            </p>
          </div>

          <input
            type="checkbox"
            checked={settings.locationSharing}
            onChange={() => toggleSetting('locationSharing')}
          />
        </div>

      </div>

      <div className="mt-6 rounded-xl border border-[#EEEDFB] p-4">
        <h2 className="font-medium mb-2">Blocked Users</h2>

        <p className="text-sm text-[#8A86A3] mb-3">
          You have no blocked users.
        </p>

        <button className="text-[#6C5CE7] font-medium text-sm">
          Manage Blocked Users
        </button>
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