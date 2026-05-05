const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

router.use(protect, admin);

// @route   GET /api/admin/stats
router.get('/stats', asyncHandler(async (req, res) => {
  const [users, courses, enrollments, leads, recentEnrollments] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Course.countDocuments(),
    Enrollment.countDocuments({ paymentStatus: 'success' }),
    Lead.countDocuments(),
    Enrollment.find({ paymentStatus: 'success' })
      .populate('user', 'name email')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .limit(5)
  ]);

  const revenueAgg = await Enrollment.aggregate([
    { $match: { paymentStatus: 'success' } },
    { $group: { _id: null, total: { $sum: '$amountPaid' } } }
  ]);
  const revenue = revenueAgg[0]?.total || 0;

  const newLeads = await Lead.countDocuments({ status: 'new' });

  res.json({
    success: true,
    stats: { users, courses, enrollments, leads, newLeads, revenue, recentEnrollments }
  });
}));

// @route   GET /api/admin/users
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
}));

// @route   PUT /api/admin/users/:id
router.put('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (typeof req.body.isActive === 'boolean') user.isActive = req.body.isActive;
  if (req.body.role && ['user', 'admin'].includes(req.body.role)) user.role = req.body.role;
  await user.save();
  res.json({ success: true, user });
}));

// @route   DELETE /api/admin/users/:id
router.delete('/users/:id', asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('Cannot delete yourself');
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, message: 'User deleted' });
}));

module.exports = router;
