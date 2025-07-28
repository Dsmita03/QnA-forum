// import onlineUsers from "../sockets/onlineUsers.js";
import { Notification } from "../models/Notification.js";
import { io } from "../index.js";

// ✅ Get all notifications (mapped to include `id`)
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    const mapped = notifications.map((n) => ({
      id: n._id.toString(),
      message: n.message,
      link: n.link,
      createdAt: n.createdAt,
      seen: n.seen,
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: "Unable to fetch notifications" });
  }
};

// ✅ Mark a single notification as read
export const markNotificationAsRead = async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: { seen: true } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Notification not found" });
    }

    // Return mapped version
    res.json({
      success: true,
      updated: {
        id: updated._id.toString(),
        message: updated.message,
        link: updated.link,
        createdAt: updated.createdAt,
        seen: updated.seen,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update notification" });
  }
};

// ✅ Send real-time + DB notification (with id in payload)
export const sendNotification = async ({ recipientId, type, message, link }) => {
  try {
    const newNotification = await Notification.create({
      userId: recipientId,
      type,
      message,
      link,
    });

    const formattedNotification = {
      id: newNotification._id.toString(),
      message: newNotification.message,
      link: newNotification.link,
      createdAt: newNotification.createdAt,
      seen: newNotification.seen,
    };

    const socketSet = onlineUsers.get(recipientId.toString());
    if (socketSet) {
      socketSet.forEach((socketId) => {
        io.to(socketId).emit("new-notification", formattedNotification);
      });
    }

    return formattedNotification;
  } catch (err) {
    console.error("Error sending notification:", err.message);
  }
};
