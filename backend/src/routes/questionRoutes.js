import express from "express";
import auth from "../middlewares/auth.js";
import {
  createQuestion,
  getAllQuestions,
  voteQuestion
} from "../controllers/questionController.js";

const questionrouter = express.Router();

questionrouter.post("/", auth, createQuestion);
questionrouter.get("/", getAllQuestions);
questionrouter.post("/vote/:id", auth, voteQuestion);

export default questionrouter;
