const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const controller = require("../controllers/answerController");

router.post("/", auth, controller.addAnswer);
router.post("/vote/:id", auth, controller.voteAnswer);
router.post("/accept", auth, controller.acceptAnswer);

module.exports = router;
