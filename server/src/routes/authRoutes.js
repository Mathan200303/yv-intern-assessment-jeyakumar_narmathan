import express from 'express';
import { register, login, getMe, getUsers } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkPermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

router.get('/users', protect, checkPermission('role.manage'), getUsers);

export default router;
