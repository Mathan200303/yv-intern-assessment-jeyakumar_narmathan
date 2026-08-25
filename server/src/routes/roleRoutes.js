const express = require('express');
const router = express.Router();
const { createRole, updatePermissions, assignRole, getRoles } = require('../controllers/roleController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');

router.use(protect);
router.use(checkPermission('role.manage'));

router.get('/', getRoles);
router.post('/', createRole);
router.put('/:id/permissions', updatePermissions);
router.post('/:id/assign', assignRole); 

module.exports = router;
