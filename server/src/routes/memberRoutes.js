const express = require('express');
const router = express.Router();
const { getMembers } = require('../controllers/memberController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');

router.get('/', protect, checkPermission('member.view'), getMembers);

module.exports = router;
