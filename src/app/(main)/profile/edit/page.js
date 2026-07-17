'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EditProfilePage() {

  const [profile, setProfile] = useState({
    username: "Foundry_4",
    name: "Foundry User",
    degree: "BS Bioinformatics",
    university: "NUST, Islamabad",
    location: "Islamabad, Pakistan",
    email: "foundry4@example.com",
    phone: "+92 300 1234567",
    bio: "Student seller on UniVerse. Interested in technology, research, and connecting with other students.",
  });


  function handleChange(e) {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  }


  return (
    <div className="p-8 max-w-xl">

      <h1 className="text-2xl font-semibold mb-6">
        Edit Profile
      </h1>


      {/* Profile Picture */}
      <div className="flex items-center gap-4 mb-8">

        <div className="w-20 h-20 rounded-full bg-[#EEEDFB] flex items-center justify-center text-[#6C5CE7] font-semibold text-xl overflow-hidden">
          F4
        </div>

        <label className="text-sm text-[#6C5CE7] font-medium cursor-pointer">
          Change photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
          />
        </label>

      </div>



      {/* Form */}

      <div className="space-y-4">


        <div>
          <label className="text-sm text-[#8A86A3]">
            Username
          </label>

          <input
            name="username"
            value={profile.username}
            onChange={handleChange}
            className="w-full mt-1 border border-[#EEEDFB] rounded-xl p-3"
          />
        </div>



        <div>
          <label className="text-sm text-[#8A86A3]">
            Full Name
          </label>

          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
            className="w-full mt-1 border border-[#EEEDFB] rounded-xl p-3"
          />
        </div>



        <div>
          <label className="text-sm text-[#8A86A3]">
            Degree
          </label>

          <input
            name="degree"
            value={profile.degree}
            onChange={handleChange}
            className="w-full mt-1 border border-[#EEEDFB] rounded-xl p-3"
          />
        </div>



        <div>
          <label className="text-sm text-[#8A86A3]">
            University
          </label>

          <input
            name="university"
            value={profile.university}
            onChange={handleChange}
            className="w-full mt-1 border border-[#EEEDFB] rounded-xl p-3"
          />
        </div>



        <div>
          <label className="text-sm text-[#8A86A3]">
            Location
          </label>

          <input
            name="location"
            value={profile.location}
            onChange={handleChange}
            className="w-full mt-1 border border-[#EEEDFB] rounded-xl p-3"
          />
        </div>



        <div>
          <label className="text-sm text-[#8A86A3]">
            Email
          </label>

          <input
            name="email"
            value={profile.email}
            onChange={handleChange}
            className="w-full mt-1 border border-[#EEEDFB] rounded-xl p-3"
          />
        </div>



        <div>
          <label className="text-sm text-[#8A86A3]">
            Phone Number
          </label>

          <input
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            className="w-full mt-1 border border-[#EEEDFB] rounded-xl p-3"
          />
        </div>


      </div>



      {/* Buttons */}

      <div className="flex gap-3 mt-8">

        <button
          className="bg-[#6C5CE7] text-white px-6 py-3 rounded-xl font-medium"
          onClick={() => alert("Profile saved successfully!")}
        >
          Save Changes
        </button>



        <Link
          href="/profile"
          className="border border-[#EEEDFB] px-6 py-3 rounded-xl font-medium"
        >
          Cancel
        </Link>


      </div>


    </div>
  );
}
