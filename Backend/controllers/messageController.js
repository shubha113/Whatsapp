import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Message from "../models/Message.js";
import ErrorHandler from '../utils/errorHandler.js'

// Get all conversations grouped by user
export const getAllConversations = catchAsyncError(async (req, res, next) => {
    const conversations = await Message.aggregate([
        {
            $group: {
                _id: "$waId",
                userName: { $first: "$userName" },
                lastMessage: { $last: "$messageBody" },
                lastTimestamp: { $last: "$timestamp" },
                messageCount: { $sum: 1 },
                unreadCount: { $sum: { $cond: [{ $ne: ["$status", "read"] }, 1, 0] } }
            }
        },
        {
            $sort: { lastTimestamp: -1 }
        }
    ]);

    res.status(200).json({
        success: true,
        count: conversations.length,
        conversations
    });
});


// To get messages for a specific conversation
export const getConversationMessages = catchAsyncError(async (req, res, next) => {
    const { waId } = req.params;
    
    if (!waId) {
        return next(new ErrorHandler("WhatsApp ID is required", 400));
    }

    const messages = await Message.find({ waId })
        .sort({ timestamp: 1 })
        .select('-__v');

    if (messages.length === 0) {
        return next(new ErrorHandler("No messages found for this conversation", 404));
    }

    res.status(200).json({
        success: true,
        count: messages.length,
        waId,
        userName: messages[0].userName,
        messages
    });
});

// To send message
export const sendMessage = catchAsyncError(async (req, res, next) => {
    const { waId, messageBody, userName } = req.body;
    
    const myBusinessNumber = process.env.BUSINESS_NUMBER; 

    if (!waId || !messageBody || !userName) {
        return next(new ErrorHandler("waId, messageBody, and userName are required", 400));
    }
    
    const trimmedMessage = messageBody.trim();
    if (!trimmedMessage) {
        return next(new ErrorHandler("Message body cannot be empty", 400));
    }
    
    const messageData = {
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        metaMessageId: `meta_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        waId,
        userName,
        messageBody: trimmedMessage,
        messageType: 'text',
        direction: 'outbound',
        status: 'sent',
        timestamp: Date.now().toString(),
        from: myBusinessNumber,
    };
    
    const newMessage = new Message(messageData);
    await newMessage.save();
    
    res.status(201).json({
        success: true,
        message: "Message sent successfully",
        data: newMessage
    });
});