import express from 'express';
import MembershipType from '../models/MembershipType.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/', protect, async (req, res, next) => {
  try {
    const types = await MembershipType.find({ isActive: true });
    res.status(200).json({ success: true, data: types });
  } catch (error) {
    next(error);
  }
});

export default router;
