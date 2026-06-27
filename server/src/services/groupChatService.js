import {
    createGroup,
    addMemberToGroup,
    groupMessages,
    getGroupMessages,
    getGroupMembers
} from "../redis/repositories/groupRepository.js";

import { saveMessage } from "../redis/repositories/messageRepository.js";

import generateId  from "../utils/idGenerator.js";

export const createGroupService = async (groupData) => {
    const { id, userId } = groupData;
    groupData = {
        ...groupData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    try {
        const group = await createGroup(groupData);
        await addMemberToGroup(id, userId); // Add the creator as a member of the group
        return group;
    } catch (error) {
        console.error('Error creating group:', error);
        throw new Error('Error creating group');
    }
}

export const addMemberToGroupService = async (groupId, memberId) => {
    try {
        await addMemberToGroup(groupId, memberId);
    } catch (error) {
        console.error('Error adding member to group:', error);
        throw new Error('Error adding member to group');
    }
}

export const sendGroupMessageService = async (messageData) => {
    const id = generateId(); // Generate a unique ID for the message
    messageData = {
        id,
        ...messageData,
        typeof: "group",
        status: "SENT",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }

    try {
        await saveMessage(messageData);
        await groupMessages(messageData.groupId, id); // Add the message ID to the group's message list
    } catch (error) {
        console.error('Error sending group message:', error);
        throw new Error('Error sending group message');
    }
}


export const getGroupMessagesService = async (groupId, page, limit) => {
    if (!page || !limit) {
        throw new Error('Page and limit parameters are required');
    }
    if( page < 1 || limit < 1) {
        throw new Error('Page and limit parameters must be greater than 0');
    }

    try {
        const messages = await getGroupMessages(groupId, page, limit);
        return messages;
    } catch (error) {
        console.error('Error getting group messages:', error);
        throw new Error('Error getting group messages');
    }
}

export const getGroupMembersService = async (groupId) => {
    try {
        const members = await getGroupMembers(groupId);
        return members;
    } catch (error) {
        console.error('Error getting group members:', error);
        throw new Error('Error getting group members');
    }
}