import express from "express";
import { getNotifications, markNotificationAsRead,markAllNotificationsAsRead } from "../controllers/notificationController.js";
import verifyToken from "../middlewares/auth.js"; 

const Notificationroute = express.Router();

Notificationroute.get("/",verifyToken,getNotifications);
Notificationroute.patch("/:id/mark-read", verifyToken, markNotificationAsRead);
Notificationroute.patch("/mark-all-read", verifyToken, markAllNotificationsAsRead);

export default Notificationroute;
