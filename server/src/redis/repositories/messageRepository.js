import { redisClient } from "../redisClient.js";

// This function saves the message data in Redis using a hash. The key is in the format `message:{messageId}` and the value is the message data object.
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


// This function used to fetch message data by using message Id.
export const getMessageById = async (messageId) => {
    // console.log("this is message id in getMessageById", messageId);
    try {
        const message = await redisClient.hgetall(`message:${messageId}`);
        // console.log("this is get message by id", message);
        return message;
    } catch (error){
        console.log("error during fetching message by id from redis", error);
    }
}

// This function is used to update the message status from SENT -> DELIVERED -> SEEN.
export const updateMessageStatus = async (messageId, status) => {
    try {
        await redisClient.hset(`message:${messageId}`, 'status', status);
    } catch(error) {
        console.log("error during updating message status in redis", error);
    }
}
