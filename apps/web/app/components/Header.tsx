"use client";

import React, { useState } from "react";

export default function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-black border-b-white border-b-2 relative">
      <div className="max-w-8xl mx-auto p-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">
          <img className="w-[25%] h-[20%]" src="./logo.png" alt="Logo" />
        </h1>

        <div className="max-w-fit relative">
          <nav className="space-x-6 text-md font-medium max-w-fit flex items-center">
            <div className="relative">
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                className="text-white inline-block focus:outline-none"
              >
                Events ▾
              </button>

              {showDropdown && (
                <div
                  className="absolute mt-2 bg-white rounded shadow-lg text-black text-sm right-0 w-40 z-50"
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <a
                    href="/events"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    View Events
                  </a>
                  <a
                    href="/add-event"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Add Event
                  </a>
                </div>
              )}
            </div>

            <a className="text-white inline-block" href="/my-bookings">
              My bookings
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
