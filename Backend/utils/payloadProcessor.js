import Message from "../models/Message.js";

// Processing incoming message payload
export const processMessagePayload = async (payload) => {
    try {
        const { metaData } = payload;
        const entry = metaData.entry[0];
        const changes = entry.changes[0];
        const value = changes.value;

        // Check if this is a message payload (not status)
        if (value.messages && value.messages.length > 0) {
            const message = value.messages[0];
            const contact = value.contacts[0];

            const messageData = {
                messageId: message.id,
                metaMessageId: message.id,
                waId: contact.wa_id,
                userName: contact.profile.name,
                messageBody: message.text.body,
                messageType: message.type,
                direction: "outbound",
                status: "sent",
                timestamp: message.timestamp,
                from: message.from,
                conversationId: entry.id
            };

            // Checking if message already exists
            const existingMessage = await Message.findOne({ 
                messageId: messageData.messageId 
            });

            if (!existingMessage) {
                const newMessage = new Message(messageData);
                await newMessage.save();
                return newMessage;
            } else {
                return existingMessage;
            }
        }
    } catch (error) {
        throw error;
    }
};


// Processing status update payload
export const processStatusPayload = async (payload) => {
    try {
        const { metaData } = payload;
        const entry = metaData.entry[0];
        const changes = entry.changes[0];
        const value = changes.value;

        // Checkung if this is a status payload
        if (value.statuses && value.statuses.length > 0) {
            const status = value.statuses[0];

            // Updating message status using meta_msg_id
            const updatedMessage = await Message.findOneAndUpdate(
                { metaMessageId: status.meta_msg_id },
                { 
                    status: status.status,
                    updatedAt: new Date()
                },
                { new: true }
            );

            if (updatedMessage) {
                return updatedMessage;
            } else {
                return null;
            }
        }
    } catch (error) {
        throw error;
    }
};


// Main payload processor
export const processWebhookPayload = async (payload) => {
    try {
        const { metaData } = payload;
        const entry = metaData.entry[0];
        const changes = entry.changes[0];
        const value = changes.value;

        // Checking payload type and processing accordingly
        if (value.messages && value.messages.length > 0) {
            return await processMessagePayload(payload);
        } else if (value.statuses && value.statuses.length > 0) {
            return await processStatusPayload(payload);
        } else {
            return null;
        }
    } catch (error) {
        throw error;
    }
};