import express from "express";
import { banUserById, getAllUsers, getTotalNoOfUsers, getUserById, login,signup,updateUserProfile } from "../controllers/authController.js";
import verifyToken from "../middlewares/auth.js";


const authRouter=express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.get("/count", getTotalNoOfUsers);
authRouter.get("/all-users",verifyToken, getAllUsers);
authRouter.get("/profile",verifyToken, getUserById);
authRouter.put("/profile", verifyToken, updateUserProfile);
authRouter.put("/ban-user/:id",banUserById);
export default authRouter;