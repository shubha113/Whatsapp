import express from 'express';
import { getAllConversations, getConversationMessages, sendMessage } from '../controllers/messageController.js';

const router = express.Router();

router.get('/conversations', getAllConversations);
router.get("/conversation/:waId", getConversationMessages);
router.post('/send', sendMessage);

export default router;