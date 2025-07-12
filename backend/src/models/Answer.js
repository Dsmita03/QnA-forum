import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    content: String,
    user: String,
    votes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export default mongoose.model("Answer", answerSchema);
