import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { acceptFriendRequest, getProfile, listDevelopers, sendFriendRequest, updateProfile } from '../controllers/userController';

const router = Router();

router.get('/devs', requireAuth, listDevelopers);
router.get('/:id', requireAuth, getProfile);
router.put('/:id', requireAuth, updateProfile);
router.post('/:id/friend-request', requireAuth, sendFriendRequest);
router.post('/:id/accept-request', requireAuth, acceptFriendRequest);

export default router;

