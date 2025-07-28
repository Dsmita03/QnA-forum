'use client';

import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Bell, LogOut, Menu, X, User, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { initSocket } from "../lib/socket";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
  seen: boolean;
  link?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Load user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        setUser({
          name: data.name || "User",
          email: data.email,
          role: data.role,
          userId: data.id,
          isLoggedIn: true,
          profileImage: data.profileImage || "/profile.png",
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    if (!user.isLoggedIn) {
      fetchProfile();
    }
  }, [user.isLoggedIn, setUser]);

  // ----- SOCKET.IO IMPLEMENTATION -----
  useEffect(() => {
    if (!user?.isLoggedIn || !user.userId) return;
    const socket = initSocket(user.userId);
    const handleNewNotification = (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
      toast(`🔔 ${data.message}`, {
        action: {
          label: "View",
          onClick: () => {
            if (data.link) router.push(data.link);
          },
        },
      });
    };
    socket.on("new-notification", handleNewNotification);
    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [user.userId, user.isLoggedIn, router]);

  // Fetch notifications from backend
  useEffect(() => {
    if (!user.isLoggedIn) return;
    async function fetchNotifications() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(res.data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 60000);
    return () => clearInterval(intervalId);
  }, [user.isLoggedIn]);

  // Close dropdowns on outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Number of unread notifications
  const unreadCount = notifications.filter((n) => !n.seen).length;

  // Mark a notification as read and update state
  async function markAsRead(notificationId: string) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      await axios.patch(
        `/api/notifications/${notificationId}/mark-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notificationId ? { ...n, seen: true } : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  }

  // On notification click, mark read and navigate to link (if any)
  async function handleNotificationClick(notification: Notification) {
    if (!notification.seen) {
      await markAsRead(notification.id);
    }
    setShowNotifications(false);
    if (notification.link) {
      router.push(notification.link);
    }
  }

  // User logout handler
  function handleLogout() {
    localStorage.removeItem("token");
    setUser({
      name: "",
      email: "",
      role: "",
      userId: "",
      isLoggedIn: false,
      profileImage: "",
    });
    router.push("/login");
  }

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

        {/* Desktop navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link
            href="/"
            className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
              pathname === "/" ? "text-orange-600 bg-orange-50" : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            }`}
          >
            Home
          </Link>
          <Link
            href="/add-questions"
            className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
              pathname === "/add-questions" ? "text-orange-600 bg-orange-50" : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
            }`}
          >
            Ask Question
          </Link>
        </div>

        {/* Right side: notifications, profile and menu */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-80 border z-50 max-h-96 overflow-y-auto">
                <div className="sticky top-0 bg-white p-3 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-800">Notifications</h4>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-gray-500 text-sm">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-orange-50 flex items-start space-x-2 ${
                        !notification.seen ? "font-semibold" : "text-gray-600"
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <span
                        className={`mt-2 h-2 w-2 rounded-full flex-shrink-0 ${
                          !notification.seen ? "bg-orange-600" : "bg-gray-300"
                        }`}
                        aria-label={notification.seen ? "Seen" : "Unseen"}
                      />
                      <div>
                        <p className="text-sm">{notification.message}</p>
                        <time className="text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </time>
                      </div>
                    </div>
                  ))
                )}
                <div className="p-3 text-center">
                  <Link href="/notifications" onClick={() => setShowNotifications(false)} className="text-orange-600 hover:underline text-sm font-medium">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-orange-200">
                <Image
                  src={user.profileImage || "/profile.png"}
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                  unoptimized
                />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-800">{user.name || "Guest"}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role || "visitor"}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-56 border z-50 overflow-hidden">
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200">
                      <Image
                        src={user.profileImage || "/profile.png"}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.name || "User"}</p>
                      <p className="text-xs text-orange-600 capitalize">{user.role || "visitor"}</p>
                    </div>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <Settings className="w-4 h-4" /> Admin Panel
                  </Link>
                </div>

                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 bg-white">
          <div className="flex flex-col space-y-2">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium rounded-lg block ${
                pathname === "/" ? "text-orange-600 bg-orange-50" : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Home
            </Link>
            <Link
              href="/add-questions"
              className={`px-4 py-2 text-sm font-medium rounded-lg block ${
                pathname === "/add-questions" ? "text-orange-600 bg-orange-50" : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
              }`}
              onClick={() => setShowMobileMenu(false)}
            >
              Ask Question
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
