"use client";

import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Bell, LogOut, Menu, X, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAppStore } from "@/store";
import { toast } from "sonner";
import { initSocket } from "@/lib/socket";
import NotificationsModal from "@/components/NotificationsModal";

interface Notification {
    id: string;
    message: string;
    createdAt: string | number | Date;
    seen: boolean;
}

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const user = useAppStore((s) => s.user);
    const setUser = useAppStore((s) => s.setUser);

    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showAllModal, setShowAllModal] = useState(false);

    const [notifications, setNotifications] = useState<Notification[]>([]);

    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

     
    useEffect(() => {
        if (user.isLoggedIn) return;

        const fetchProfile = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            try {
                const { data } = await axios.get("/api/auth/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
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

        fetchProfile();
    }, [setUser, user.isLoggedIn]);

    
    useEffect(() => {
        if (!user.isLoggedIn || !user.userId) return;

        const socket = initSocket(user.userId);

        const handleNewNotification = (data: Notification) => {
            setNotifications((prev) => [data, ...prev]);
            toast(`🔔 ${data.message}`);
        };

        socket.on("notification", handleNewNotification);

        return () => {
            socket.off("notification", handleNewNotification);
            socket.disconnect();
        };
    }, [user.userId, user.isLoggedIn]);

    
    useEffect(() => {
        if (!user.isLoggedIn) return;

        const fetchNotifications = async () => {
            try {
                const res = await axios.get(
                    "https://qna-forum.onrender.com/api/notifications",
                    {
                        withCredentials: true,
                    }
                );
                setNotifications(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    res.data.map((n: any) => ({ ...n, id: n._id })) // normalise _id ➜ id
                );
            } catch (err) {
                console.error("Failed to fetch notifications:", err);
            }
        };

        fetchNotifications();
        const id = setInterval(fetchNotifications, 60_000);
        return () => clearInterval(id);
    }, [user.isLoggedIn]);

    
    useEffect(() => {
        const closeOnOutside = (e: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(e.target as Node)
            ) {
                setShowNotifications(false);
            }
            if (
                profileRef.current &&
                !profileRef.current.contains(e.target as Node)
            ) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener("mousedown", closeOnOutside);
        return () => document.removeEventListener("mousedown", closeOnOutside);
    }, []);

    
    const unreadCount = notifications.filter((n) => !n.seen).length;

    // const markAsRead = async (id: string) => {
    //   try {
    //     const token = localStorage.getItem("token");
    //     if (!token) return;
    //     // optimistic UI
    //     setNotifications((prev) =>
    //       prev.map((n) => (n.id === id ? { ...n, seen: true } : n))
    //     );
    //     await axios.patch(
    //       `/api/notifications/${id}/mark-read`,
    //       {},
    //       { headers: { Authorization: `Bearer ${token}` } }
    //     );
    //   } catch (err) {
    //     console.error("Error marking notification as read:", err);
    //   }
    // };

    const markAllAsRead = async () => {
        // try {
        //   // const token = localStorage.getItem("token");
        //   if (!token) return;
        //   setNotifications((prev) => prev.map((n) => ({ ...n, seen: true }))); // optimistic
        //   await axios.patch(
        //     "/api/notifications/mark-all-read",
        //     {},
        //     { headers: { Authorization: `Bearer ${token}` } }
        //   );
        // } catch (err) {
        //   console.error("Error marking all notifications as read:", err);
        // }
        try {
            const response = await axios.patch(
                "https://qna-forum.onrender.com/api/notifications/mark-all-read",
                {},
                {
                    withCredentials: true,
                }
            );
            setNotifications([]);
            if (response.status === 200) {
                toast("All notifications marked as read");
            }
        } catch (error) {
            console.log("Error marking all notifications as read", error);
        }
    };

    // const handleNotificationClick = async (n: Notification) => {
    //   if (!n.seen) await markAsRead(n.id);
    //   setShowNotifications(false);
    //   // if you have links, navigate here
    // };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser({
            name: "",
            email: "",
            role: undefined,
            userId: "",
            isLoggedIn: false,
            profileImage: "",
        });
        router.push("/login");
    };

     
    return (
        <nav className="bg-white shadow-md border-b border-orange-100 px-4 py-3 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* ------------------------------------------------ Logo ---------- */}
                <Link href="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                        StackIt
                    </span>
                </Link>

                {/* --------------------------------------- Desktop Nav Links ------ */}
                <div className="hidden lg:flex items-center space-x-6">
                    <Link
                        href="/home"
                        className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                            pathname === "/"
                                ? "text-orange-600 bg-orange-50"
                                : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/add-questions"
                        className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                            pathname === "/add-questions"
                                ? "text-orange-600 bg-orange-50"
                                : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                        }`}
                    >
                        Ask Question
                    </Link>
                </div>

                {/* Right Side */}
                <div className="flex items-center space-x-3">
                    <div className="relative" ref={notificationRef}>
                        <button
                            aria-label="Notifications"
                            onClick={() => setShowNotifications((p) => !p)}
                            className="relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg w-80 z-50 max-h-96 overflow-y-auto">
                                {/* header */}
                                <div className="sticky top-0 bg-white p-3 border-b border-gray-100 flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-800">
                                        Notifications
                                    </h4>
                                    <button
                                        onClick={markAllAsRead}
                                        disabled={notifications.every(
                                            (n) => n.seen
                                        )}
                                        className="text-xs font-medium text-orange-600 disabled:opacity-40"
                                    >
                                        Mark all read
                                    </button>
                                </div>
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-gray-500 text-sm">
                                        No notifications
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <button
                                            key={n.id}
                                            // onClick={() => handleNotificationClick(n)}
                                            className={`w-full text-left p-3 border-b border-gray-100 hover:bg-orange-50 flex items-start space-x-2 ${
                                                !n.seen
                                                    ? "font-semibold"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            <span
                                                className={`mt-2 h-2 w-2 rounded-full flex-shrink-0 ${
                                                    n.seen
                                                        ? "bg-gray-300"
                                                        : "bg-orange-600"
                                                }`}
                                            />
                                            <div>
                                                <p className="text-sm">
                                                    {n.message}
                                                </p>
                                                <time className="text-xs text-gray-400">
                                                    {new Date(
                                                        n.createdAt
                                                    ).toLocaleString()}
                                                </time>
                                            </div>
                                        </button>
                                    ))
                                )}
                                <div className="p-3 text-center">
                                    <button
                                        onClick={() => {
                                            setShowNotifications(false);
                                            setShowAllModal(true);
                                        }}
                                        className="text-orange-600 hover:underline text-sm font-medium"
                                    >
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                     
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setShowProfileMenu((p) => !p)}
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
                                <p className="text-sm font-medium text-gray-800">
                                    {user.name || "Guest"}
                                </p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {user.role || "visitor"}
                                </p>
                            </div>
                        </button>

                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 bg-white border shadow-lg rounded-lg w-56 z-50 overflow-hidden">
                                <div className="p-3 border-b border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-orange-200">
                                            <Image
                                                src={
                                                    user.profileImage ||
                                                    "/profile.png"
                                                }
                                                alt={user.name || "User"}
                                                width={40}
                                                height={40}
                                                className="rounded-full"
                                                unoptimized
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">
                                                {user.name || "User"}
                                            </p>
                                            <p className="text-xs text-orange-600 capitalize">
                                                {user.role || "visitor"}
                                            </p>
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

                    
                    <button
                        onClick={() => setShowMobileMenu((p) => !p)}
                        className="lg:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg"
                    >
                        {showMobileMenu ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            
            {showMobileMenu && (
                <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 bg-white">
                    <div className="flex flex-col space-y-2">
                        <Link
                            href="/home"
                            onClick={() => setShowMobileMenu(false)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg block ${
                                pathname === "/"
                                    ? "text-orange-600 bg-orange-50"
                                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                            }`}
                        >
                            Home
                        </Link>
                        <Link
                            href="/add-questions"
                            onClick={() => setShowMobileMenu(false)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg block ${
                                pathname === "/add-questions"
                                    ? "text-orange-600 bg-orange-50"
                                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                            }`}
                        >
                            Ask Question
                        </Link>
                    </div>
                </div>
            )}

            
            <NotificationsModal
                open={showAllModal}
                onClose={() => setShowAllModal(false)}
                // onItemClick={(n) => { void handleNotificationClick(n); }}
                onMarkAllRead={markAllAsRead}
            />
        </nav>
    );
}
