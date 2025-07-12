import express from "express";
import auth from "../middlewares/auth.js";
import { addComment } from "../controllers/commentController.js";

const commentRouter = express.Router();

commentRouter.post("/", auth, addComment);

export default commentRouter;
