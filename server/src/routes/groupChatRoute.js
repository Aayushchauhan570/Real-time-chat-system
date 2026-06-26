import { Router } from "express";

const router = Router();

router.post('/group/create');

router.post('/group/add-member');

router.post('/group/message');

router.get('/group/:groupId/messages');

router.get('/group/:groupId/members');

router.delete('/group/:groupId/member/:memberId');

export default router;