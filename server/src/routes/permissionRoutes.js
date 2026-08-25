const express = require('express');
const router = express.Router();
const { getPermissionsList } = require('../controllers/roleController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');

router.get('/', protect, checkPermission('role.manage'), getPermissionsList);

module.exports = router;
