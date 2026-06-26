import { redisClient } from "../redisClient.js";
import { getMessageById } from "./messageRepository.js";

// This function creates a message list/queue for conversation between two users.
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


// This function used to fetch all conversation messages between two users.
export const getConversation = async (userId1, userId2, offset = 0, limit = 20) => {
    const chatKey = [userId1, userId2].sort().join(':');
    try{
        const messageIds = await redisClient.lrange(`chat:${chatKey}`, offset, offset + limit - 1);
        let messages = [];
        // console.log("this is message ids in get conversation", messageIds);
        // messages = await Promise.all(messageIds.map(async (id) => {
        //     return getMessageById(id);
        // }));

        const pipeline = redisClient.pipeline();
        messageIds.forEach((id) => {
            pipeline.hgetall(`message:${id}`);
        });
        const result = await pipeline.exec();
        messages = result.map(([error, message]) => message);
        return messages;
    } catch (error) {
        console.log("error during fetching messages from redis", error);
    }
}


// This function used to remove message from the message list/queue one by one using rpop.
export const removeMessageFromList = async (senderId, receiverId) => {
    const chatKey = [senderId, receiverId].sort().join(':');
    try {
        const message = await redisClient.rpop(`chat:${chatKey}`);
        return message;
    } catch (error) {
        console.log("error during rpop in redis", error.message);
    }
}


export const conversationList = async (senderId, receiverId) => {
    console.log("this is sender id in conversation list", senderId);
    console.log(typeof receiverId);
    console.log("this is receiver id in conversation list", receiverId);
    try {
        await redisClient.zadd(`userConversation:${senderId}`, Date.now(), receiverId );
        await redisClient.zadd(`userConversation:${receiverId}`, Date.now(), senderId );
    } catch (error) {
        console.log("error during adding user conversation in redis", error);
        throw new Error("Failed to add user conversation"); // Rethrow the error to be handled by the service
    }
} 

export const getConversationsList = async (userId) => {
    try {
        const conversations = await redisClient.zrevrange(`userConversation:${userId}`, 0, 19, 'WITHSCORES');
        return conversations;
    } catch (error) {
        console.log("error during fetching user conversations from redis", error);
        throw new Error("Failed to fetch user conversations"); // Rethrow the error to be handled by the service
    }
}

export const conversationMetadata = async (data) => {
    const {senderId, receiverId, message, timestamp} = data;
    const chatkey = [senderId, receiverId].sort().join(':');
    try {
        await redisClient.hset(`conversationMetadata:${chatkey}`,{receiverId, "lastMessage": message, timestamp});
    } catch (error) {
        console.log("error during setting conversation metadata in redis", error);
        throw new Error("Failed to set conversation metadata"); // Rethrow the error to be handled by the service
    }
}

export const getConversationMetadata = async (senderId) => {
    try {
        const conversationList = await getConversationsList(senderId);
        console.log("this is conversation list in get conversation metadata", conversationList);
        let metadata = [];

        const pipeline = redisClient.pipeline();
        for( const otherUserId of conversationList) {
            const chatkey = [senderId, otherUserId].sort().join(':');
            pipeline.hgetall(`conversationMetadata:${chatkey}`);
        }

        const result = await pipeline.exec();
        metadata = result.map(([error, data]) => data);
        return metadata;
    } catch (error) {
        console.log("error during fetching conversation metadata from redis", error);
        throw new Error("Failed to fetch conversation metadata"); // Rethrow the error to be handled by the service
    }
}