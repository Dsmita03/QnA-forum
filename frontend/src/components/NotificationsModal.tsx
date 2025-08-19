"use client";
import { X, AlertTriangle } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

export interface Notification {
    id: string;
    message: string;
    createdAt: string | number | Date;
    seen: boolean;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onMarkAllRead: () => void;
}

export default function NotificationsModal({
    open,
    onClose,
    onMarkAllRead,
}: Props) {
    const [allNotification, setAllNotification] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!open) return; // Only fetch when modal is open

            setLoading(true);
            try {
                const response = await axios.get(
                    "https://qna-forum.onrender.com/api/notifications/all",
                    {
                        withCredentials: true,
                    }
                );

                if (response.status === 200) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const rawData: any[] = response.data; // Don't assume type initially

                    console.log("Raw API response:", rawData);

                    // Process and validate each notification
                    const processedNotifications: Notification[] = rawData
                        .map((item, index) => {
                            // Ensure we have a valid object
                            if (!item || typeof item !== "object") {
                                console.warn(
                                    `Invalid notification at index ${index}:`,
                                    item
                                );
                                return null;
                            }

                            // Create a valid notification with guaranteed unique ID
                            return {
                                id: String(
                                    item.id || `fallback-${Date.now()}-${index}`
                                ),
                                message: String(item.message || "No message"),
                                createdAt:
                                    item.createdAt || new Date().toISOString(),
                                seen: Boolean(item.seen),
                            };
                        })
                        .filter((item): item is Notification => item !== null); // Remove null items

                    // Ensure all IDs are unique by adding suffixes to duplicates
                    const seenIds = new Set<string>();
                    const uniqueNotifications = processedNotifications.map(
                        (notification) => {
                            let uniqueId = notification.id;
                            let counter = 1;

                            while (seenIds.has(uniqueId)) {
                                uniqueId = `${notification.id}-dup-${counter}`;
                                counter++;
                            }

                            seenIds.add(uniqueId);

                            return {
                                ...notification,
                                id: uniqueId,
                            };
                        }
                    );

                    console.log(
                        "Processed notifications with unique IDs:",
                        uniqueNotifications
                    );
                    setAllNotification(uniqueNotifications);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setAllNotification([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [open]);

    const handleMarkAllRead = async () => {
        try {
            await onMarkAllRead();
            setAllNotification((prev) =>
                prev.map((n) => ({ ...n, seen: true }))
            );
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl border border-orange-100 flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        🔔 All Notifications
                    </h3>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleMarkAllRead}
                            disabled={
                                allNotification.every((n) => n.seen) || loading
                            }
                            className="px-3 py-1.5 text-sm font-medium text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 hover:border-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Mark all read
                        </button>

                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-orange-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                            <p className="text-gray-500 mt-2">
                                Loading notifications...
                            </p>
                        </div>
                    ) : allNotification.length === 0 ? (
                        <div className="p-8 text-center space-y-3">
                            <AlertTriangle className="w-10 h-10 mx-auto text-gray-300" />
                            <p className="text-gray-500">No notifications</p>
                        </div>
                    ) : (
                        allNotification.map((notification) => (
                            <button
                                key={notification.id} // This will now always be unique
                                className={`w-full text-left p-4 hover:bg-orange-50 transition-colors ${
                                    !notification.seen ? "bg-orange-50/50" : ""
                                }`}
                                onClick={() => {
                                    console.log(
                                        "Notification clicked:",
                                        notification.id
                                    );
                                }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p
                                            className={`text-sm ${
                                                !notification.seen
                                                    ? "font-semibold text-gray-800"
                                                    : "text-gray-600"
                                            }`}
                                        >
                                            {notification.message}
                                        </p>
                                        <time className="text-xs text-gray-400 mt-1 block">
                                            {new Date(
                                                notification.createdAt
                                            ).toLocaleString()}
                                        </time>
                                    </div>
                                    {!notification.seen && (
                                        <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-2 ml-2"></div>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
