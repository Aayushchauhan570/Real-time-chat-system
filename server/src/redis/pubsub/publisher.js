import { redisClient } from "../redisClient.js";

// This function is used to publish message data to redis channel for sending message to other user in real time using redis Pub/Sub protocol.
export const publisher = async (messageData) => {
    const parsedMessageData = JSON.parse(JSON.stringify(messageData));
    // console.log("messageData in publish function", JSON.stringify({type: 'NEW_MESSAGE', data: parsedMessageData}));
    try {
        await redisClient.publish('chat_channel', JSON.stringify({type: 'NEW_MESSAGE', data: parsedMessageData}));
    } catch (error) {
        console.log("error during publishing message to redis", error);
    }
}


export const groupPublisher = async (messageData) => {
    const parsedMessageData = JSON.parse(JSON.stringify(messageData));
    try {
        await redisClient.publish('group_chat_channel', JSON.stringify({type: "NEW_GROUP_MESSAGE", data: parsedMessageData}));
    } catch (error) {
        console.log("error during publishing group message to redis", error);
        throw new Error("error during publishing group message to redis", error);
    }
}