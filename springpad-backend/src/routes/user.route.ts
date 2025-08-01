import express from 'express';
import { verifyFirebaseToken } from '../middlewares/auth.middleware';
import { deleteUser, getProfile, updateProfile } from '../controllers/user.controller';

const router = express.Router();

router.get('/me', verifyFirebaseToken, getProfile);
router.patch('/me', verifyFirebaseToken, updateProfile);
router.delete('/me', verifyFirebaseToken, deleteUser);

export default router;
