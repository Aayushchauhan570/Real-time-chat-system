import {
    saveMessage,
    getMessageById,
    updateMessageStatus,
    editMessage,
    deleteMessage
} from '../redis/repositories/messageRepository.js';

import {
    conversation,
    getConversation,
    removeMessageFromList
} from '../redis/repositories/conversationRepository.js';

import {
    setUnreadCount,
    getUnreadCount,
    resetUnReadCount
} from '../redis/repositories/unreadAndSeenRepository.js';

import { getUserPresence } from '../redis/repositories/presenceRepository.js'

import { publisher } from '../redis/pubsub/publisher.js';
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


export const getMessagesService = async (userId1, userId2, offset, limit) => {
    try{
        const messages = await getConversation(userId1, userId2, offset, limit);
        return messages;
    } catch (error) {
        console.log("error during fetching messages", error);
    }
}

export const editMessageService = async (messageId, updatedMessage) => {
    try {
        const message = await getMessageById(messageId);
        if (!message || message.deleted === 'true') {
            throw new Error('Message not found or has been deleted');
        }
        await editMessage(messageId, updatedMessage);
        return message;
    } catch (error) {
        console.log("error during editing message", error);
        throw error; // Rethrow the error to be handled by the controller
    }
}

export const deleteMessageService = async (messageId ) => {
    try {
        const message = await getMessageById(messageId);
        if (!message || message.deleted === 'true') {
            throw new Error('Message not found or has been deleted');
        }
        await deleteMessage(messageId);
        return message;
    } catch (error) {
        console.log("error during deleting message", error);
        throw error; // Rethrow the error to be handled by the controller
    }
}

export const removeConversationService = async (senderId, receiverId) => {
    try {
        return await removeMessageFromList(senderId, receiverId);
    } catch (error) {
        console.log("error during removing from list", error.message);
        throw error; // Rethrow the error to be handled by the controller
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

export const checkUserPresenceService = async (userId) => {
    try {
        const userData = await getUserPresence(userId);
        return userData;
    } catch (error) {
        console.log("error during checking user presence", error.message);
    }
}