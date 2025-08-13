import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
    },
    metaMessageId: {
      type: String,
      required: true,
    },
    waId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    messageBody: {
      type: String,
      required: true,
    },
    messageType: {
      type: String,
      default: "text",
    },
    direction: {
      type: String,
      default: "outbound",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    timestamp: {
      type: String,
      required: true,
    },
    from: {
      type: String,
      required: true,
    },
    conversationId: {
      type: String,
    },
  },
  { timestamps: true }
);

//index for faster queries
messageSchema.index({ waId: 1, timestamp: -1 });
messageSchema.index({ messageId: 1 });
messageSchema.index({ metaMessageId: 1 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
