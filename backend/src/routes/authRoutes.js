import express from "express";
import { getTotalNoOfUsers, login,signup } from "../controllers/authController.js";

const authRouter=express.Router();

authRouter.post("/login", login);
authRouter.post("/signup", signup);
authRouter.get("/count", getTotalNoOfUsers);
export default authRouter;