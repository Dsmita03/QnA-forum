import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import questionrouter from "./routes/questionRoutes.js";
import answerrouter from "./routes/answerRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import authRouter from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import uploadRouter from "./routes/uploadRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import reportRouter from "./routes/reportRoute.js";
dotenv.config();

const app = express();

// ✅ Enable CORS
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(cookieParser());

// app.use(cors());
// ✅ Middleware
app.use(express.json());
//cookie-parser


// ✅ For serving images from /uploads (dirname fix for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));



// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ✅ Routes
app.use("/api/questions", questionrouter);
app.use("/api/answers", answerrouter);
app.use("/api/comments", commentRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/report", reportRouter);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("QnA Forum API is running!");
});

// ✅ Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
