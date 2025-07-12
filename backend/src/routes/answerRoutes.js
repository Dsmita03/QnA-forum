import express from "express";
import auth from "../middlewares/auth.js";
import {
  addAnswer,
  voteAnswer,
  acceptAnswer,
} from "../controllers/answerController.js";

const answerrouter = express.Router();

answerrouter.post("/", auth, addAnswer);
answerrouter.post("/vote/:id", auth, voteAnswer);
answerrouter.post("/accept", auth, acceptAnswer);

export default answerrouter;
