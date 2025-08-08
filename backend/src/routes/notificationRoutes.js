import express from "express";
import { getNotifications,markAllNotificationsAsRead ,getAllNotifications} from "../controllers/notificationController.js";
import verifyToken from "../middlewares/auth.js"; 

const Notificationroute = express.Router();

Notificationroute.get("/",verifyToken,getNotifications);
Notificationroute.get("/all", verifyToken, getAllNotifications);
Notificationroute.patch("/mark-all-read", verifyToken, markAllNotificationsAsRead);

export default Notificationroute;
