import express from "express";
// import verifyToken from "../middlewares/auth.js";
import {
  createQuestion,
  decreaseLike,
  getAllQuestions,
  getQuestionById,
  increaseLike,
  voteQuestion
} from "../controllers/questionController.js";
import verifyToken from "../middlewares/auth.js";

const questionrouter = express.Router();

questionrouter.post("/", 
  // verifyToken,
   createQuestion);
questionrouter.get("/", getAllQuestions);
questionrouter.get("/:id",getQuestionById);
questionrouter.post("/vote/:id",
  //  verifyToken, 
   voteQuestion);
questionrouter.put("/increase-like",verifyToken, increaseLike);
questionrouter.put("/decrease-like", verifyToken,decreaseLike);

export default questionrouter;
