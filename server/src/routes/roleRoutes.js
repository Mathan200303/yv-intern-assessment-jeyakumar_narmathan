import express from 'express';
import { createRole, updatePermissions, assignRole, getRoles } from '../controllers/roleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkPermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();
router.use(protect);
router.use(checkPermission('role.manage'));

router.get('/', getRoles);
router.post('/', createRole);
router.put('/:id/permissions', updatePermissions);
router.post('/:id/assign', assignRole); 

export default router;
