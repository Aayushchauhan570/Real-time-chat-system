import { Router } from "express";
import  {
    createGroup,
    addMemberToGroup,
    sendGroupMessage,
    getGroupMessages,
    getGroupMembers,
    // removeMemberFromGroup
} from "../controllers/groupChatController.js";

const router = Router();

router.post('/group/create', createGroup);

router.post('/group/add-member', addMemberToGroup);

router.post('/group/message', sendGroupMessage);

router.get('/group/:groupId/messages', getGroupMessages);

router.get('/group/:groupId/members', getGroupMembers);

// router.delete('/group/:groupId/member/:memberId', removeMemberFromGroup);

export default router;