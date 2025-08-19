import { Notification } from "../models/Notification.js";
import { io } from "../index.js";   // the instance you exported
import { onlineUsers } from "../sockets/index.js"; // may need to export this map

// Call this from your route/controller for notification trigger
export const sendNotification = async ({
  recipientId,
  senderId,
  referenceId,
  type,
  message,
}) => {
  try {
    // Save notification to DB
    const notification = await Notification.create({
      recipientId,
      senderId,
      referenceId,
      type,
      message,
    });

    // Real-time emit via socket.io
    const sockets = onlineUsers.get(String(recipientId));
    if (sockets && sockets.size > 0) {
      for (const socketId of sockets) {
        io.to(socketId).emit("notification", {
          _id: notification._id,
          senderId,
          referenceId,
          type,
          message,
          createdAt: notification.createdAt,
          seen: notification.seen,
        });
      }
    }

    return notification;
  } catch (err) {
    console.error("Notification error:", err);
    throw err;
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.id,seen:false }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}; 
// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Notification.updateMany(
      { recipientId: userId, seen: false },
      { seen: true }
    );

    res.status(200).json({ 
      message: "All notifications marked as read",
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error("Error marking all notifications as read:", err);
    res.status(500).json({ error: "Failed to mark all notifications as read" });
  }
};