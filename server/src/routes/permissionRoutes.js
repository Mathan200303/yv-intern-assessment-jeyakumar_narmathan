import express from 'express';
import { getPermissionsList } from '../controllers/roleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkPermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();
router.get('/', protect, checkPermission('role.manage'), getPermissionsList);

export default router;
