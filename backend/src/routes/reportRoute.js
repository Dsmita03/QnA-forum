import express from "express";
import { submitReport } from "../controllers/reportController.js";
import verifyToken from "../middlewares/auth.js";


const reportRouter=express.Router()

reportRouter.post("/submit",verifyToken,submitReport)
export default reportRouter