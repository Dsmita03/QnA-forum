import express from "express";
import verifyToken from "../middlewares/auth.js";
import { addComment } from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/", verifyToken, addComment);

export default commentRouter;
