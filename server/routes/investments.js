const express = require('express');
const asyncHandler = require('express-async-handler');
const Investment = require('../models/Investment');
const { protect } = require('../middleware/auth');

const router = express.Router();

// GET /api/investments/me - Get current user's investments
router.get('/me', protect, asyncHandler(async (req, res) => {
  const investments = await Investment.find({ user: req.user._id })
    .populate('addedBy', 'name email')
    .sort({ date: -1 });
  res.json({ success: true, count: investments.length, investments });
}));

module.exports = router;
