import {
    sendMessageService,
    getMessagesService,
    removeConversationService,
    getUnreadCountService,
    checkUserPresenceService,
    editMessageService,
    deleteMessageService,
    getConversationMetadataService
} from '../services/chatService.js';

import {getIO} from '../socket/socket.js';

export const sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    if (!senderId || !receiverId || !message) {
        return res.status(400).json({ error: 'senderId, receiverId and message are required' });
    }
    try {
        await sendMessageService({ senderId, receiverId, message });
        return res.status(200).json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.log("error during sending message", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getMessages = async (req, res) => {
    const { userId1, userId2 } = req.params;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 20;
    if (!userId1 || !userId2) {
        return res.status(400).json({ error: 'userId1 and userId2 are required' });
    }
    try {
        const messages = await getMessagesService(userId1, userId2, offset, limit);
        return res.status(200).json({ success: true, offset, limit, messages });
    } catch (error) {
        console.log("error during fetching messages", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const editMessage = async (req, res) => {
    const { messageId } = req.params;
    const { message } = req.body;
    if (!messageId || !message) {
        return res.status(400).json({ error: 'messageId and message are required' });
    }
    try {
        const msg = await editMessageService(messageId, message);
        const { senderId, receiverId } = msg;
        const chatKey = [senderId, receiverId].sort().join(':');
        const io = getIO();
        io.to(chatKey).emit("messageEdited", { messageId, message });
        return res.status(200).json({status: true, message: "message updated successfully"});
    } catch (error) {
        if(error.message === 'Message not found or has been deleted'){
            return res.status(404).json({error: error.message});
        }
        const io = getIO();
        io.to(chatKey).emit("messageEdited", { messageId, message });
        return res.status(200).json({status: true, message: "message updated successfully"});
    }
}

export const deleteMessage = async (req, res) => {
    const { messageId } = req.params;
    if (!messageId) {
        return res.status(400).json({ error: 'messageId is required' });
    }
    try {
        const msg = await deleteMessageService(messageId);
        const { senderId, receiverId } = msg;
        const chatKey = [senderId, receiverId].sort().join(':');
        const io = getIO();
        io.to(chatKey).emit("messageDeleted", { messageId });
        return res.status(200).json({ success: true, message: 'Message deleted successfully' });
    } catch (error) {
        if(error.message === 'Message not found or has been deleted'){
            return res.status(404).json({error: error.message});
        }
        console.log("error during deleting message", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const removeConversation = async (req, res) => {
    const { senderId, receiverId } = req.params;
    if (!senderId || !receiverId) {
        return res.status(400).json({ error: 'senderId and receiverId are required' });
    }
    try {
        const mess = await removeConversationService(senderId, receiverId);
        return res.status(200).json({ success: true, message: 'Conversation removed successfully', mess });
    } catch (error) {
        console.log("error during removing conversation", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export const getUnreadCount = async (req, res) => {
    const { userId1, userId2 } = req.params;
    if (!userId1 || !userId2) {
        return res.status(400).json({ error: 'userId1 and userId2 are required' });
    }
    try {
        const count = await getUnreadCountService(userId1, userId2);
        return res.status(200).json({ success: true, unreadCount: count });
    } catch (error) {
        console.log("error during fetching unread count", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


// This is the function to check if a user is online or not. It will be used in the presence feature.
export const checkUserPresence = async (req, res) => {
    const { userId } = req.params;
    try {
        const userData = await checkUserPresenceService(userId);
        return res.status(200).json({ success: true, userData });
    } catch (error) {
        console.log("error during checking user presence", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}


export const getConversationMetadata = async (req, res) => {
    const { senderId } = req.params;
    try {
        const metadata = await getConversationMetadataService(senderId);
        return res.status(200).json({ success: true, metadata });
    } catch (error) {
        console.log("error during fetching conversation metadata", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}