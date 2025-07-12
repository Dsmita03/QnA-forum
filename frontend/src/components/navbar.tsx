'use client';

import Link from "next/link";
import Image from "next/image";
import { Bell, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    "Bob answered your question",
    "Alice mentioned you in a comment",
    "Your answer received an upvote",
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem("token"); // or sessionStorage
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-orange-500">
          StackIt
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-gray-700">
          <Link
            href="/"
            className={pathname === "/" ? "text-orange-500" : "hover:text-orange-500"}
          >
            Home
          </Link>
         <Link
          href="/add-questions"
         className={pathname === "/add-questions" ? "text-orange-500" : "hover:text-orange-500"}
        >
         Ask
         </Link>
          </div>

        {/* Notifications and Profile */}
        <div className="flex items-center gap-4 relative">
          {/* Bell Icon */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative focus:outline-none"
          >
            <Bell className="w-5 h-5 text-gray-600 hover:text-orange-500" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-16 top-10 bg-white shadow-lg rounded-md w-64 p-4 text-sm z-50">
              <h4 className="font-semibold text-gray-800 mb-2">Notifications</h4>
              <ul className="space-y-2">
                {notifications.map((note, i) => (
                  <li key={i} className="text-gray-600 border-b pb-1 last:border-b-0">
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Profile Image + Menu */}
          <div className="relative">
            <button onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <Image
                src="/profile.png"
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full cursor-pointer hover:scale-105 transition"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 bg-white shadow-md rounded-md text-sm z-50">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-50">
                  Profile
                </Link>
                <Link href="/admin" className="block px-4 py-2 hover:bg-gray-50">
                  Admin Panel
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
