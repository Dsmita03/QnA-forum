import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ensures every question has an author
    },
    answerId: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);