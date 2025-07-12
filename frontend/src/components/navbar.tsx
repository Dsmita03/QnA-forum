'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    "Bob answered your question",
    "Alice mentioned you in a comment",
    "Your answer received an upvote",
  ];

  return (
    <nav className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="text-2xl font-bold text-orange-500">
          StackIt
        </Link>

        {/* Center: Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link
            href="/"
            className={pathname === "/" ? "text-orange-500" : "hover:text-orange-500"}
          >
            Home
          </Link>
          <Link
            href="/tags"
            className={pathname === "/tags" ? "text-orange-500" : "hover:text-orange-500"}
          >
            Tags
          </Link>
          <Link
            href="/ask"
            className={pathname === "/ask" ? "text-orange-500" : "hover:text-orange-500"}
          >
            Ask
          </Link>
        </div>

        {/* Right: Notification + Profile */}
        <div className="flex items-center gap-4 relative">
          {/* Bell Notification */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative focus:outline-none"
          >
            <Bell className="w-5 h-5 text-gray-600 hover:text-orange-500" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {showNotifications && (
            <div className="absolute right-10 top-10 bg-white shadow-lg rounded-md w-64 p-4 text-sm z-50">
              <h4 className="font-semibold text-gray-800 mb-2">Notifications</h4>
              <ul className="space-y-2">
                {notifications.map((note, i) => (
                  <li key={i} className="text-gray-600 border-b pb-1">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Profile Dropdown */}
          <div className="group relative cursor-pointer">
            <div className="flex items-center gap-1 text-gray-700 hover:text-orange-500">
              <User className="w-5 h-5" />
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md text-sm hidden group-hover:block z-50">
              <Link href="/profile" className="block px-4 py-2 hover:bg-gray-50">
                Profile
              </Link>
              <Link href="/admin" className="block px-4 py-2 hover:bg-gray-50">
                Admin Panel
              </Link>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-500">
                <LogOut className="inline w-4 h-4 mr-1" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
