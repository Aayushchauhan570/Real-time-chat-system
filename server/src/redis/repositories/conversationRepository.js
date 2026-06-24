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