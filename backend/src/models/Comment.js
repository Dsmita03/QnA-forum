import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: String,
    user: String,
    answerId: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);