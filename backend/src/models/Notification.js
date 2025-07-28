import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "User",
    // },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Question', 
    },
    type: {
      type: String,
      required: true,  
    },
    message: {
      type: String,
      required: true,
    },
     
    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // only createdAt, no updatedAt
  }
);

export const Notification = mongoose.model("Notification", notificationSchema);

 