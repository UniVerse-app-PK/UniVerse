'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ChangePasswordPage() {
  const [showPasswords, setShowPasswords] = useState(false);

  const [passwords, setPasswords] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });

  function handleChange(e) {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  }

  const strength =
    passwords.newPassword.length >= 12
      ? 'Strong'
      : passwords.newPassword.length >= 8
      ? 'Medium'
      : 'Weak';

  return (
    <div className="p-8 max-w-xl">
      <h1 className="text-2xl font-semibold mb-6">
        Change Password
      </h1>

      <div className="space-y-4">

        <div>
          <label className="text-sm text-[#8A86A3]">
            Current Password
          </label>

          <input
            type={showPasswords ? 'text' : 'password'}
            name="current"
            value={passwords.current}
            onChange={handleChange}
            className="w-full mt-1 border border-[#EEEDFB] rounded-xl p-3"
          />
        </div>

        <div>
          <label className="text-sm text-[#8A86A3]">
            New Password
          </label>

          <input
            type={showPasswords ? 'text' : 'password'}
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
            className="w-full mt-1 border border-[#EEEDFB] rounded-xl p-3"
          />
        </div>

        <div>
          <label className="text-sm text-[#8A86A3]">
            Confirm New Password
          </label>

          <input
            type={showPasswords ? 'text' : 'password'}
            name="confirm"
            value={passwords.confirm}
            onChange={handleChange}
            className="w-full mt-1 border border-[#EEEDFB] rounded-xl p-3"
          />
        </div>

        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showPasswords}
            onChange={() => setShowPasswords(!showPasswords)}
          />
          Show passwords
        </label>

        <div className="rounded-xl bg-[#F4F3FE] p-4">
          <p className="font-medium mb-2">
            Password Strength: <span className="text-[#6C5CE7]">{strength}</span>
          </p>

          <ul className="text-sm text-[#8A86A3] space-y-1">
            <li>✓ At least 8 characters</li>
            <li>✓ One uppercase letter</li>
            <li>✓ One number</li>
            <li>✓ One special character</li>
          </ul>
        </div>

      </div>

      <div className="flex gap-3 mt-8">

        <button
          onClick={() => alert('Password changed successfully!')}
          className="bg-[#6C5CE7] text-white px-6 py-3 rounded-xl font-medium"
        >
          Change Password
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