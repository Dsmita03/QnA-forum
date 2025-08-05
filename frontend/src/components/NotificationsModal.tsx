"use client";
import { X } from "lucide-react";
export interface Notification {
  id: string;
  message: string;
  createdAt: string | number | Date;
  seen: boolean;
}
import { AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  onItemClick: (n: Notification) => void;
  onMarkAllRead: () => void;
}

export default function NotificationsModal({
  open,
  onClose,
  notifications,
  onItemClick,
}: Props) {
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
            {/* <Button
              size="sm"
              variant="outline"
              onClick={onMarkAllRead}
              disabled={notifications.every((n) => n.seen)}
              className="text-orange-600 border-orange-300 hover:bg-orange-50 hover:border-orange-400 disabled:opacity-40"
            >
              Mark all read
            </Button> */}

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-orange-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <AlertTriangle className="w-10 h-10 mx-auto text-gray-300" />
              <p className="text-gray-500">No notifications</p>
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => onItemClick(n)}
                className={`w-full text-left p-4 hover:bg-orange-50 transition-colors ${
                  !n.seen ? "bg-orange-50/50" : ""
                }`}
              >
                <p
                  className={`text-sm ${
                    !n.seen ? "font-semibold text-gray-800" : "text-gray-600"
                  }`}
                >
                  {n.message}
                </p>
                <time className="text-xs text-gray-400">
                  {new Date(n.createdAt).toLocaleString()}
                </time>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
