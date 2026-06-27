import { createGroupService,
    addMemberToGroupService,
    sendGroupMessageService,
    getGroupMessagesService,
    getGroupMembersService
 } from "../services/groupChatService.js";

// this is used to create a new group and add the creator as a member of the group
export const createGroup = async (req, res) => {
    const groupData = req.body;
    try {
        const group = await createGroupService(groupData);
        res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Error creating group', error: error.message });
    }
}


// this is used to add a member to an existing group.
export const addMemberToGroup = async (req, res) => {
    const { groupId, memberId } = req.body;
    console.log("groupId and memberId in addMemberToGroup controller", groupId, memberId);
    try {
        await addMemberToGroupService(groupId, memberId);
        res.status(200).json({ message: 'Member added to group successfully' });
    } catch (error) {
        console.error('Error adding member to group:', error);
        res.status(500).json({ message: 'Error adding member to group', error: error.message });
    }
}

// this is used to post message to a group and send the message to all the members of the group in real time using redis pub/sub protocol.
export const sendGroupMessage = async (req, res) => {
    const messageData = req.body;
    try {
        await sendGroupMessageService(messageData);
        res.status(200).json({ message: 'Message sent to group successfully' });
    } catch (error) {
        console.error('Error sending group message:', error);
        res.status(500).json({ message: 'Error sending group message', error: error.message });
    }
}


// this is used to get all the messages of a group with pagination support. The messages are sorted by createdAt in descending order. The page and limit query parameters are used for pagination. The default page is 1 and the default limit is 10. The response contains the messages, total count of messages, current page and total pages.
export const getGroupMessages = async (req, res) => {
    const { groupId } = req.params;
    const { page } = req.query || 1;
    const { limit } = req.query || 10;

    try {
        const messages = await getGroupMessagesService(groupId, page, limit);
        res.status(200).json({ messages });
    } catch (error) {
        console.error('Error getting group messages:', error);
        res.status(500).json({ message: 'Error getting group messages', error: error.message });
    }
}

// this is used to get all the members of a group. The response contains the members of the group.
export const getGroupMembers = async (req, res) => {
    const { groupId } = req.params;

    try {
        const members = await getGroupMembersService(groupId);
        res.status(200).json({ members });
    } catch (error) {
        console.error('Error getting group members:', error);
        res.status(500).json({ message: 'Error getting group members', error: error.message });
    }
}

// this is used to remove a member from a group. The memberId is the id of the member to be removed from the group. The groupId is the id of the group from which the member is to be removed. The response contains the message and the updated list of members of the group.
// export const removeMemberFromGroup = async (req, res) => {
//     const { groupId, memberId } = req.params;

//     try {

//     }
// }