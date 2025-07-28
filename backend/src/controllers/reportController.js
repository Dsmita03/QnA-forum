import { Report } from "../models/Report.js";
import { Question } from "../models/Question.js";
import { sendNotification } from "./notificationController.js";


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
 
export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find({})
            .populate('reporterId', 'name email')
            .populate({ 
                path: 'questionId', 
                select: 'title description user',
                populate: { 
                    path: 'user', 
                    select: 'name email' 
                }
            })
            .sort({ createdAt: -1 });
        console.log("Fetched reports:", reports);
        const flaggedItems = reports.map(report => ({
            id: report._id.toString(),
            type: 'question',
            title: report.questionId?.title || 'Question not found',
            content: report.questionId?.description || 'Content unavailable',
            author: report.questionId?.user?.name || 'Unknown',
            authorEmail: report.questionId?.user?.email || 'unknown@email.com',
            reportedBy: report.reporterId?.name || 'Anonymous',
            reason: report.message || 'No reason provided',
            category: report.reason || 'other',
            status: report.status === 'accepted' ? 'reviewed' : report.status === 'rejected' ? 'dismissed' : 'pending',
            createdAt: report.createdAt,
            reportedAt: report.createdAt,
            originalUrl: `/questions/${report.questionId?._id || ''}`
        }));
        
        res.json(flaggedItems);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch reports" });
    }
};

// Update your updateReportStatus function to return updated stats
export const updateReportStatus = async (req, res) => {
    try {
        const { flagId } = req.params;
        const { action } = req.body;
        const report = await Report.findById(flagId)
            .populate({
                path: 'questionId',
                populate: {
                    path: 'user',  
                    select: 'name email'
                }
            })
            .populate('reporterId', 'name');
        
        if (!report || report.status !== 'pending') {
            return res.status(404).json({ error: "Report not found or already processed" });
        }
        
        if (action === 'approve') {
            if (report.questionId) {
                await Question.findByIdAndDelete(report.questionId._id);
                
                await sendNotification({
                    recipientId: report.questionId.user._id,
                    type: 'question_removed',
                    message: `Your question "${report.questionId.title}" has been removed due to policy violation.`,
                    link: `/reports/${flagId}`
                });
            }
            report.status = 'accepted';
        } else if (action === 'dismiss') {
            report.status = 'rejected';
        }
        
        report.processedAt = new Date();
        report.processedBy = req.user.id;
        await report.save();
        
        // ✅ Get updated stats to return
        const updatedStats = {
            total: await Report.countDocuments(),
            pending: await Report.countDocuments({ status: 'pending' }),
            reviewed: await Report.countDocuments({ status: 'accepted' }),
            dismissed: await Report.countDocuments({ status: 'rejected' })
        };
        
        res.json({ 
            message: `Report ${action}d successfully`,
            updatedStats  
        });
    } catch (error) {
        console.error("Error updating report status:", error);
        res.status(500).json({ error: "Failed to update report status" });
    }
};

export const getReportStats = async (req, res) => {
    try {
        const total = await Report.countDocuments();
        const pending = await Report.countDocuments({ status: 'pending' });
        const reviewed = await Report.countDocuments({ status: 'accepted' });
        const dismissed = await Report.countDocuments({ status: 'rejected' });
        res.json({ total, pending, reviewed, dismissed });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch statistics" });
    }
};

 