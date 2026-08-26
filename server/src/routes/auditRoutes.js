import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { protect } from '../middleware/authMiddleware.js';
import { checkPermission } from '../middleware/permissionMiddleware.js';

const router = express.Router();
router.get('/', protect, checkPermission('audit.view'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const logs = await AuditLog.find()
      .populate('actorUserId', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await AuditLog.countDocuments();

    res.status(200).json({
      success: true,
      data: {logs, pagination: {total,page,pages: Math.ceil(total / limit)}
      },
      message: 'Audit logs retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
