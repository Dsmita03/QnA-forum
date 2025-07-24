'use client';

import Link from "next/link";
import Image from "next/image";
import { Bell, LogOut, Menu, X, User, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, text: "Bob answered your question", time: "2m ago", unread: true },
    { id: 2, text: "Alice mentioned you in a comment", time: "5m ago", unread: true },
    { id: 3, text: "Your answer received an upvote", time: "1h ago", unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };


  return (
    <nav className="bg-white shadow-md border-b border-orange-100 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            StackIt
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link href="/" className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
            pathname === "/" ? "text-orange-600 bg-orange-50" : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
          }`}>
            Home
          </Link>
          <Link href="/add-questions" className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
            pathname === "/add-questions" ? "text-orange-600 bg-orange-50" : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
          }`}>
            Ask Question
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-72 border z-50">
                <div className="p-3 border-b">
                  <h4 className="font-semibold text-gray-800">Notifications</h4>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50">
                      <div className="flex items-start space-x-2">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.unread ? 'bg-orange-500' : 'bg-gray-300'}`} />
                        <div>
                          <p className="text-sm text-gray-800">{notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-orange-50 transition-colors">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-200">
                <Image src="/profile.png" alt="Profile" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800">Lily</p>
                <p className="text-xs text-gray-500">Developer</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-56 border z-50">
                <div className="p-3 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200">
                      <Image src="/profile.png" alt="Profile" width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Lily</p>
                      <p className="text-xs text-orange-600">Developer</p>
                    </div>
                  </div>
                </div>
                
                <div className="py-1">
                  <Link href="/profile" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  <Link href="/admin" className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
                    <Settings className="w-4 h-4" />
                    <span>Admin Panel</span>
                  </Link>
                </div>

                <div className="border-t py-1">
                  <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg">
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden mt-4 pb-4 border-t">
          <div className="flex flex-col space-y-2 pt-4">
            <Link href="/" className={`px-4 py-2 text-sm font-medium rounded-lg ${
              pathname === "/" ? "text-orange-600 bg-orange-50" : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            }`} onClick={() => setShowMobileMenu(false)}>
              Home
            </Link>
            <Link href="/add-questions" className={`px-4 py-2 text-sm font-medium rounded-lg ${
              pathname === "/add-questions" ? "text-orange-600 bg-orange-50" : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            }`} onClick={() => setShowMobileMenu(false)}>
              Ask Question
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
