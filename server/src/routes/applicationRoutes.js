import express from 'express';
import { submitApplication,  getApplications, approveApplication, rejectApplication } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkPermission } from '../middleware/permissionMiddleware.js';
import User from '../models/User.js';

const router = express.Router();
router.use(protect);

router.post('/', submitApplication);

const viewAppCheck = async (req, res, next) => {
  if (req.user.userType === 'MEMBER' || req.user.userType === 'CHAIRMAN') {
    return next();
  }
  try {
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

export default router;
