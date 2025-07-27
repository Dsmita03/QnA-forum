import { Report } from "../models/Report.js";

export const submitReport= async(req,res)=>{
    try{
        const {questionId,reason,message}=req.body; 
        const reporterId=req.user.id;
        console.log(reporterId);
       const report=await Report.create({reporterId,questionId,reason,message});
       res.status(201).json({message:"Report submitted successfully"});              
    }catch(error){
        res.status(500).json({ error: "Failed to submit report" });
    }
}