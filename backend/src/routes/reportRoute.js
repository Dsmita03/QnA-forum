import express from "express";
import { submitReport,getAllReports,updateReportStatus,getReportStats } from "../controllers/reportController.js";
import verifyToken from "../middlewares/auth.js";


const reportRouter=express.Router()

reportRouter.post("/submit",verifyToken,submitReport)
reportRouter.get("/admin/flags", verifyToken, getAllReports);
reportRouter.get("/admin/flags/stats", verifyToken, getReportStats);
reportRouter.patch("/admin/flags/:flagId", verifyToken, updateReportStatus);
export default reportRouter