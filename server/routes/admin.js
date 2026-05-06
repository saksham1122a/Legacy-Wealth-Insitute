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

// GET /api/admin/stats
router.get('/stats', asyncHandler(async (req, res) => {
  const [users, courses, leads, totalEnrollments, pendingEnrollments, activeEnrollments] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Course.countDocuments(),
    Lead.countDocuments(),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ enrollmentStatus: 'pending' }),
    Enrollment.countDocuments({ enrollmentStatus: 'active' })
  ]);

  const recentEnrollments = await Enrollment.find()
    .populate('user', 'name email')
    .populate('course', 'title')
    .sort({ createdAt: -1 })
    .limit(5);

  const revenueAgg = await Enrollment.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$amountPaid' } } }
  ]);
  const revenue = revenueAgg[0]?.total || 0;
  const newLeads = await Lead.countDocuments({ status: 'new' });

  res.json({
    success: true,
    stats: { users, courses, leads, newLeads, revenue, totalEnrollments, pendingEnrollments, activeEnrollments, recentEnrollments }
  });
}));

// GET /api/admin/enrollments
router.get('/enrollments', asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};
  if (status && status !== 'all') filter.enrollmentStatus = status;

  let enrollments = await Enrollment.find(filter)
    .populate('user', 'name email phone')
    .populate('course', 'title category price discountPrice')
    .populate('approvedBy', 'name')
    .sort({ createdAt: -1 });

  if (search) {
    const q = search.toLowerCase();
    enrollments = enrollments.filter(e =>
      e.user?.name?.toLowerCase().includes(q) ||
      e.user?.email?.toLowerCase().includes(q) ||
      e.course?.title?.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: enrollments.length, enrollments });
}));

// PATCH /api/admin/enrollments/:id/approve
router.patch('/enrollments/:id/approve', asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) { res.status(404); throw new Error('Enrollment not found'); }

  enrollment.enrollmentStatus = 'active';
  enrollment.approvedBy = req.user._id;
  enrollment.approvedAt = new Date();
  if (req.body.notes) enrollment.adminNotes = req.body.notes;
  await enrollment.save();

  res.json({ success: true, enrollment });
}));

// PATCH /api/admin/enrollments/:id/reject
router.patch('/enrollments/:id/reject', asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) { res.status(404); throw new Error('Enrollment not found'); }

  enrollment.enrollmentStatus = 'rejected';
  if (req.body.notes) enrollment.adminNotes = req.body.notes;
  await enrollment.save();

  res.json({ success: true, enrollment });
}));

// PATCH /api/admin/enrollments/:id/payment
router.patch('/enrollments/:id/payment', asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) { res.status(404); throw new Error('Enrollment not found'); }

  enrollment.paymentStatus = req.body.paymentStatus || 'paid';
  await enrollment.save();

  res.json({ success: true, enrollment });
}));

// GET /api/admin/users
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
}));

// PUT /api/admin/users/:id
router.put('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (typeof req.body.isActive === 'boolean') user.isActive = req.body.isActive;
  if (req.body.role && ['user', 'admin'].includes(req.body.role)) user.role = req.body.role;
  await user.save();
  res.json({ success: true, user });
}));

// DELETE /api/admin/users/:id
router.delete('/users/:id', asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400); throw new Error('Cannot delete yourself');
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, message: 'User deleted' });
}));

module.exports = router;
