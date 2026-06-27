import {redisClient} from '../redisClient.js';

export const createGroup = async (groupData) => {
    const {id } = groupData;
    try {
        const group = await redisClient.hset(`group:${id}`, groupData);
        return group;
    } catch (error) {
        console.log(`Error creating group: ${error}`);
        throw new Error(`Error creating group: ${error}`);
    }
}

// export const getGroupById = async (groupId) => {

export const addMemberToGroup = async (groupId, memberId) => {
    // memberId are the array of userIds to be added to the group
    try {
        const groupExists = await redisClient.exists(`group:${groupId}`);
        if (!groupExists) {
            throw new Error(`Group with ID ${groupId} does not exist`);
        }
        await redisClient.sadd(`group:${groupId}:members`, memberId);
        await redisClient.sadd(`user:${memberId}:groups`, groupId); // Add the group ID to the user's list of groups
    } catch (error) {
        console.log(`Error adding member to group: ${error}`);
        throw new Error(`Error adding member to group: ${error}`);
    }
}

export const getGroupMembers = async (groupId) => {
    try {
        const members = await redisClient.smembers(`group:${groupId}:members`);
        return members;
    } catch (error) {
        console.log(`Error getting group members: ${error}`);
        throw new Error(`Error getting group members: ${error}`);
    }
}

export const removeMemberFromGroup = async (groupId, memberId) => {
    try {
        const groupExists = await redisClient.exists(`group:${groupId}`);
        if (!groupExists) {
            throw new Error(`Group with ID ${groupId} does not exist`);
        }
        await redisClient.srem(`group:${groupId}:members`, memberId);
    } catch (error) {
        console.log(`Error removing member from group: ${error}`);
        throw new Error(`Error removing member from group: ${error}`);
    }
}

export const groupMessages = async (groupId, messageId) => {
    try {
        await redisClient.rpush(`group:${groupId}:messages`, messageId);
    } catch (error) {
        console.log(`Error adding message to group: ${error}`);
        throw new Error(`Error adding message to group: ${error}`);
    }
}

export const getGroupMessages = async (groupId, page, limit) => {
    try {
        const start = (page - 1) * limit;
        const end = start + limit - 1;
        const messageIds = await redisClient.lrange(`group:${groupId}:messages`, start, end);
        const pipeline = redisClient.pipeline();

        messageIds.forEach((id) => {
            pipeline.hgetall(`message:${id}`);
        })

        const result = await pipeline.exec();

        return result.map(([error, message]) => message);
    } catch (error) {
        console.log(`Error getting group messages: ${error}`);
        throw new Error(`Error getting group messages: ${error}`);
    }
}