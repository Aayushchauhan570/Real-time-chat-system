import {redisClient} from './redisClient.js';

export const saveMessage = async (messageData) => {
    const mess_id = messageData.id;
    // console.log("this is message id in save message", mess_id);
    try {
        const data = await redisClient.hset(`message:${messageData.id}`, messageData);
        // console.log("this is data after setting message in redis", data);
    } catch (error) {
        console.log("error during setting message in redis", error);
    }
}

export const conversation = async (messageData) => {
    const { senderId, receiverId } = messageData;
    // console.log(messageData.id);
    const chatKey = [senderId, receiverId].sort().join(':');
    try{
        await redisClient.lpush(`chat:${chatKey}`,messageData.id);
    } catch (error) {
        console.log("error during adding message to redis", error);
    }
}

const getMessageById = async (messageId) => {
    // console.log("this is message id in getMessageById", messageId);
    try {
        const message = await redisClient.hgetall(`message:${messageId}`);
        // console.log("this is get message by id", message);
        return message;
    } catch (error){
        console.log("error during fetching message by id from redis", error);
    }
}

export const getConverstion = async (userId1, userId2) => {
    const chatKey = [userId1, userId2].sort().join(':');
    try{
        const messageIds = await redisClient.lrange(`chat:${chatKey}`, 0, -1);
        let messages = [];
        // console.log("this is message ids in get conversation", messageIds);
        messages = await Promise.all(messageIds.map(async (id) => {
            return getMessageById(id);
        }));
        return messages;
    } catch (error) {
        console.log("error during fetching messages from redis", error);
    }
}

export const removeMessageFromList = async (senderId, receiverId) => {
    const chatKey = [senderId, receiverId].sort().join(':');
    try {
        const message = await redisClient.rpop(`chat:${chatKey}`);
        return message;
    } catch (error) {
        console.log("error during rpop in redis", error.message);
    }
}

export const publisher = async (messageData) => {
    const parsedMessageData = JSON.parse(JSON.stringify(messageData));
    // console.log("messageData in publish function", JSON.stringify({type: 'NEW_MESSAGE', data: parsedMessageData}));
    try {
        await redisClient.publish('chat_channel', JSON.stringify({type: 'NEW_MESSAGE', data: parsedMessageData}));
    } catch (error) {
        console.log("error during publishing message to redis", error);
    }
}

export const updateMessageStatus = async (messageId, status) => {
    try {
        await redisClient.hset(`message:${messageId}`, 'status', status);
    } catch(error) {
        console.log("error during updating message status in redis", error);
    }
}

export const setUnreadCount = async (senderId, receiverId) => {
    try {
        await redisClient.incr(`unread:${senderId}:${receiverId}`);
        console.log(`Unread count incremented for ${senderId} -> ${receiverId}`);
    } catch (error) {
        console.log("error during updating unread count in redis", error);
    }
}

export const resetUnReadCount = async (senderId, receiverId) => {
    try {
        await redisClient.set(`unread:${senderId}:${receiverId}`, 0);
        console.log(`Unread count reset for ${senderId} -> ${receiverId}`);
    } catch (error) {
        console.log("error during resetting unread count in redis", error);
    }
}

export const getUnreadCount = async (userId1, userId2) => {
    try {
        const count = await redisClient.get(`unread:${userId1}:${userId2}`);
        console.log(`Redis Unread count for ${userId1} -> ${userId2}:`, count);
        return count;
    } catch(error) {
        console.log("error during fetching unread count from redis", error);
    }
}