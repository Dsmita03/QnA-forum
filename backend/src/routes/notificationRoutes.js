import express from "express";
import { getNotifications } from "../controllers/notificationController.js";
import verifyToken from "../middlewares/auth.js"; 

const Notificationroute = express.Router();

Notificationroute.get("/",verifyToken, 
    getNotifications
     );
Notificationroute.patch("/:id/mark-read",verifyToken,
    //  markNotificationAsRead
    );

export default Notificationroute;
