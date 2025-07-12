import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    content: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ensures every question has an author
    },
    votes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export const Answer = mongoose.model("Answer", answerSchema);
