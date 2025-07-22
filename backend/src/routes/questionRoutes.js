import express from "express";
// import verifyToken from "../middlewares/auth.js";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  voteQuestion
} from "../controllers/questionController.js";

const questionrouter = express.Router();

questionrouter.post("/", 
  // verifyToken,
   createQuestion);
questionrouter.get("/", getAllQuestions);
questionrouter.get("/:id",getQuestionById);
questionrouter.post("/vote/:id",
  //  verifyToken, 
   voteQuestion);


export default questionrouter;
