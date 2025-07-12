const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const controller = require("../controllers/questionController");

router.post("/", auth, controller.createQuestion);
router.get("/", controller.getAllQuestions);
router.post("/vote/:id", auth, controller.voteQuestion);

module.exports = router;
