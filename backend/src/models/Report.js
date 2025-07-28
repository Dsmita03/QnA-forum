import mongoose from "mongoose";

const reportSchema = mongoose.Schema({
    reporterId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    questionId: {type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true},
    reason: {type: String, required: true, enum: ["spam", "inappropriate", "harassment", "copyright", "other"]},
    message: {type: String, required: true},
    status: {type: String, enum: ["pending", "accepted", "rejected"], default: "pending"},
    processedAt: {type: Date},
    processedBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
}, {timestamps: true});

export const Report = mongoose.model("Report", reportSchema);
