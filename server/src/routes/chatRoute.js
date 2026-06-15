import Router from 'express';
import {sendMessage, getMessages, removeConversation, getUnreadCount } from '../controllers/chatController.js';


const router = Router();

router.post('/message', sendMessage);
router.get('/messages/:userId1/:userId2', getMessages);

router.delete('/conversation/:senderId/:receiverId', removeConversation);

router.get('/unreadCount/:userId1/:userId2', getUnreadCount)

export default router;