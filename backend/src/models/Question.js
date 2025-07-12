import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    tags: [String],
    user: String,
    votes: { type: Number, default: 0 },
    acceptedAnswer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer" },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);