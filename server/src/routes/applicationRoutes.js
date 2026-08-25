const express = require('express');
const router = express.Router();
const { submitApplication,  getApplications, approveApplication, rejectApplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { checkPermission } = require('../middleware/permissionMiddleware');

router.use(protect);

router.post('/', submitApplication);

const viewAppCheck = async (req, res, next) => {
  if (req.user.userType === 'MEMBER' || req.user.userType === 'CHAIRMAN') {
    return next();
  }
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id).populate('officerRoleId');
    if (user && user.userType === 'OFFICER' && user.officerRoleId?.permissions?.includes('application.view')) {
      return next();
    }
    return res.status(403).json({ success: false, error: { code: 'FORBIDDEN', details: ['Missing required permission: application.view'] } });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', details: ['Error checking permissions'] } });
  }
};
router.get('/', viewAppCheck, getApplications);

router.patch('/:id/approve', checkPermission('application.approve'), approveApplication);
router.patch('/:id/reject', checkPermission('application.reject'), rejectApplication);

module.exports = router;
