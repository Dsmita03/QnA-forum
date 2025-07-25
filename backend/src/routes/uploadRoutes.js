import express from "express";
import { upload } from "../middlewares/upload.js";
import verifyToken from "../middlewares/auth.js";

const uploadRouter = express.Router();

uploadRouter.post(
  "/image",
  verifyToken,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  }
);

export default uploadRouter;
