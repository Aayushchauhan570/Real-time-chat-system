import { redisClient } from "../redisClient.js";

export const setUserPresence = async (userId, status) => {
    const key = `user:${userId}:presence`;
    try {
        if(status){
            await redisClient.hset(key, {
                online: true,
                lastSeen: null
            })
        } else {
            await redisClient.hset(key, {
                online: false,
                lastSeen: Date.now()
            })
        }
    } catch (error) {
        console.log("error during setting user presence", error.message);
    }
}

export const getUserPresence = async (userId) => {
    try {
        const presenceData = await redisClient.hgetall(`user:${userId}:presence`);
        return {
            online: presenceData.online === 'true',
            lastSeen: presenceData.lastSeen ? parseInt(presenceData.lastSeen) : null
        }
    } catch (error) {
        console.log("error during getting user presence", error.message);
    }
}