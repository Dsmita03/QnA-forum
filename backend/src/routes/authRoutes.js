import express from "express";
import { getTotalNoOfUsers, getUserById, login,signup } from "../controllers/authController.js";

const authRouter=express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.get("/count", getTotalNoOfUsers);
authRouter.get("/profile", getUserById);
export default authRouter;