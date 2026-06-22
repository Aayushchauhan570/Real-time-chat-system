import { redisClient } from "../redisClient.js";

// This function is used to count the number of unread messages for a user send by the other user.
export const setUnreadCount = async (senderId, receiverId) => {
    try {
        await redisClient.incr(`unread:${senderId}:${receiverId}`);
        console.log(`Unread count incremented for ${senderId} -> ${receiverId}`);
    } catch (error) {
        console.log("error during updating unread count in redis", error);
    }
}


// This function is used to reset the unread count to 0 When user opens the conversation and all messages are seen.
export const resetUnReadCount = async (senderId, receiverId) => {
    try {
        await redisClient.set(`unread:${senderId}:${receiverId}`, 0);
        console.log(`Unread count reset for ${senderId} -> ${receiverId}`);
    } catch (error) {
        console.log("error during resetting unread count in redis", error);
    }
}


// This function is used to get the unread count between two users to show the count of unread messages in the conversation list.
export const getUnreadCount = async (userId1, userId2) => {
    try {
        const count = await redisClient.get(`unread:${userId1}:${userId2}`);
        console.log(`Redis Unread count for ${userId1} -> ${userId2}:`, count);
        return count;
    } catch(error) {
        console.log("error during fetching unread count from redis", error);
    }
}