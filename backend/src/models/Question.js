import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    tags: [String],
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ensures every question has an author
    },
    votes: { type: Number, default: 0 },
    acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
  },
  { timestamps: true }
);

export const Question = mongoose.model("Question", questionSchema);