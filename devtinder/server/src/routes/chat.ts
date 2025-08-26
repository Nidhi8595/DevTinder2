import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getChatHistory, sendMessage } from '../controllers/chatController';

const router = Router();

router.get('/:connectionId', requireAuth, getChatHistory);
router.post('/send', requireAuth, sendMessage);

export default router;

