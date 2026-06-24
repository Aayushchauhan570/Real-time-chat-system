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

// This function is to edit message or update message.
export const editMessage = async (messageId, updatedMessage ) => {
    try {
        await redisClient.hset(`message:${messageId}`, "message", updatedMessage, "edited", true, "editTimestamp", new Date().toISOString());
    } catch (error) {
        console.log("error during editing message in redis", error);
    }
}

// This function is used to delete a message from Redis by using the message Id. It will delete the hash stored in Redis for that particular message.
export const deleteMessage = async (messageId) => {
    try {
        await redisClient.hset(`message:${messageId}`, 'deleted', true, 'deleteTimestamp', new Date().toISOString());
    } catch (error) {
        console.log("error during deleting message in redis", error);
    }
}


// This function used to fetch message data by using message Id.
export const getMessageById = async (messageId) => {
    // console.log("this is message id in getMessageById", messageId);
    try {
        const message = await redisClient.hgetall(`message:${messageId}`);
        // console.log("this is get message by id", message);
        
        if(!message || Object.keys(message).length === 0) {
            throw new Error('Message not found or has been deleted');
        }

        if(message.deleted === 'true'){
            message.message = "This message has been deleted";
        }
        return message;
    } catch (error){
        console.log("error during fetching message by id from redis", error);
        throw error; // Rethrow the error to be handled by the service
    }
}

// This function is used to update the message status from SENT -> DELIVERED -> SEEN.
export const updateMessageStatus = async (messageId, status) => {
    try {
        await redisClient.hset(`message:${messageId}`, 'status', status);
    } catch(error) {
        console.log("error during updating message status in redis", error);
        throw error; // Rethrow the error to be handled by the service
    }
}
