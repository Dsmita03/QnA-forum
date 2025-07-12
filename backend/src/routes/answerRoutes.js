import express from "express";
import verifyToken from "../middlewares/auth.js";
import {
  addAnswer,
  voteAnswer,
  acceptAnswer,
} from "../controllers/answerController.js";

const answerrouter = express.Router();

answerrouter.post("/", verifyToken, addAnswer);
answerrouter.post("/vote/:id", verifyToken, voteAnswer);
answerrouter.post("/accept", verifyToken, acceptAnswer);

export default answerrouter;
