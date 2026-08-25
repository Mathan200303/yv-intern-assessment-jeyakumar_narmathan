const express = require('express');
const router = express.Router();
const MembershipType = require('../models/MembershipType');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res, next) => {
  try {
    const types = await MembershipType.find({ isActive: true });
    res.status(200).json({ success: true, data: types });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
