import { sendMessageService, getMessagesService, removeConversationService, getUnreadCountService } from '../services/chatService.js';

export const sendMessage = async (req, res) => {
    const { senderId, receiverId, message } = req.body;
    if (!senderId || !receiverId || !message) {
        return res.status(400).json({error: 'senderId, receiverId and message are required'});
    }
    try{
        await sendMessageService({ senderId, receiverId, message });
        return res.status(200).json({success: true, message: 'Message sent successfully'});
    } catch (error) {
        console.log("error during sending message", error);
        return res.status(500).json({error: 'Internal server error'});
    }
}

export const getMessages = async (req, res) => {
    const { userId1, userId2 } = req.params;
    if (!userId1 || !userId2 ) {
        return res.status(400).json({error: 'userId1 and userId2 are required'});
    }
    try{
        const messages = await getMessagesService(userId1, userId2);
        return res.status(200).json({success: true, messages});
    } catch (error) {
        console.log("error during fetching messages", error);
        return res.status(500).json({error: 'Internal server error'});
    }
}

export const removeConversation = async(req, res) => {
    const {senderId, receiverId} = req.params;
    if(!senderId || !receiverId) {
        return res.status(400).json({error: 'senderId and receiverId are required'});
    }
    try{
        const mess = await removeConversationService(senderId, receiverId);
        return res.status(200).json({success: true, message: 'Conversation removed successfully', mess});
    } catch (error) {
        console.log("error during removing conversation", error);
        return res.status(500).json({error: 'Internal server error'});
    }
}

export const getUnreadCount = async (req, res) => {
    const {userId1, userId2} = req. params;
    if(!userId1 || !userId2) {
        return res.status(400).json({error: 'userId1 and userId2 are required'});
    }
    try{
        const count = await getUnreadCountService(userId1, userId2);
        return res.status(200).json({success: true, unreadCount: count});
    } catch (error) {
        console.log("error during fetching unread count", error);
        return res.status(500).json({error: 'Internal server error'});
    }
}