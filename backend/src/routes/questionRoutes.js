import express from "express";
import verifyToken from "../middlewares/auth.js";
import {
  createQuestion,
  getAllQuestions,
  voteQuestion
} from "../controllers/questionController.js";

const questionrouter = express.Router();

questionrouter.post("/", verifyToken, createQuestion);
questionrouter.get("/", getAllQuestions);
questionrouter.post("/vote/:id", verifyToken, voteQuestion);


export default questionrouter;
