import {conversation, getConverstion, removeMessageFromList, publisher, saveMessage,setUnreadCount, getUnreadCount} from '../redis/redisHelper.js';
import idGenerator from '../utils/idGenerator.js';

export const sendMessageService = async (messageData) => {
    const id = idGenerator();
    messageData = { id, ...messageData, timestamp: new Date().toISOString(), status: 'sent' };
    try{
        await saveMessage(messageData);
        await conversation(messageData);
        await setUnreadCount(messageData.senderId, messageData.receiverId);
        await publisher(messageData);
    } catch (error) {
        console.log("error during sending message", error);
    }
}
export const getMessagesService = async (userId1, userId2) => {
    try{
        const messages = await getConverstion(userId1, userId2);
        return messages;
    } catch (error) {
        console.log("error during fetching messages", error);
    }
}

export const removeConversationService = async (senderId, receiverId) => {
    try {
        return await removeMessageFromList(senderId, receiverId);
    } catch (error) {
        console.log("error during removing from list", error.message);
    }
}

export const getUnreadCountService = async (userId1, userId2) => {
    try {
        const count = await getUnreadCount(userId1, userId2);
        console.log("this is unread count in service", count);
        return count;
    } catch (error) {
        console.log("error during fetching unread count", error.message);
    }
}