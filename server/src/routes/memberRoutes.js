import express from 'express';
import { getMembers } from '../controllers/memberController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkPermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();
router.get('/', protect, checkPermission('member.view'), getMembers);

export default router;
