const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const controller = require("../controllers/commentController");

router.post("/", auth, controller.addComment);

module.exports = router;
