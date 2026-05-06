const express = require('express');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();
router.use(protect, admin);

// ─── STATS ────────────────────────────────────────────────────────────────────
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

  res.json({ success: true, stats: { users, courses, leads, newLeads, revenue, totalEnrollments, pendingEnrollments, activeEnrollments, recentEnrollments } });
}));

// ─── ENROLLMENTS ──────────────────────────────────────────────────────────────
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

router.patch('/enrollments/:id/approve', asyncHandler(async (req, res) => {
  const e = await Enrollment.findById(req.params.id);
  if (!e) { res.status(404); throw new Error('Enrollment not found'); }
  e.enrollmentStatus = 'active';
  e.approvedBy = req.user._id;
  e.approvedAt = new Date();
  if (req.body.notes) e.adminNotes = req.body.notes;
  await e.save();
  res.json({ success: true, enrollment: e });
}));

router.patch('/enrollments/:id/reject', asyncHandler(async (req, res) => {
  const e = await Enrollment.findById(req.params.id);
  if (!e) { res.status(404); throw new Error('Enrollment not found'); }
  e.enrollmentStatus = 'rejected';
  if (req.body.notes) e.adminNotes = req.body.notes;
  await e.save();
  res.json({ success: true, enrollment: e });
}));

router.patch('/enrollments/:id/payment', asyncHandler(async (req, res) => {
  const e = await Enrollment.findById(req.params.id);
  if (!e) { res.status(404); throw new Error('Enrollment not found'); }
  e.paymentStatus = req.body.paymentStatus || 'paid';
  await e.save();
  res.json({ success: true, enrollment: e });
}));

// ─── LESSONS ──────────────────────────────────────────────────────────────────

// GET /api/admin/lessons?courseId=:id
router.get('/lessons', asyncHandler(async (req, res) => {
  const { courseId } = req.query;
  if (!courseId) { res.status(400); throw new Error('courseId required'); }
  const lessons = await Lesson.find({ course: courseId }).sort({ moduleId: 1, order: 1 });
  res.json({ success: true, count: lessons.length, lessons });
}));

// POST /api/admin/lessons
router.post('/lessons', asyncHandler(async (req, res) => {
  const { courseId, moduleId, title, description, type, videoUrl, duration, order, isPreview, content, resources } = req.body;
  if (!courseId || !moduleId || !title) { res.status(400); throw new Error('courseId, moduleId and title are required'); }

  const lastLesson = await Lesson.findOne({ course: courseId, moduleId }).sort({ order: -1 });
  const nextOrder = order ?? ((lastLesson?.order ?? -1) + 1);

  const lesson = await Lesson.create({ course: courseId, moduleId, title, description, type, videoUrl, duration, order: nextOrder, isPreview, content, resources });
  res.status(201).json({ success: true, lesson });
}));

// PUT /api/admin/lessons/:id
router.put('/lessons/:id', asyncHandler(async (req, res) => {
  const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!lesson) { res.status(404); throw new Error('Lesson not found'); }
  res.json({ success: true, lesson });
}));

// DELETE /api/admin/lessons/:id
router.delete('/lessons/:id', asyncHandler(async (req, res) => {
  const lesson = await Lesson.findByIdAndDelete(req.params.id);
  if (!lesson) { res.status(404); throw new Error('Lesson not found'); }
  res.json({ success: true, message: 'Lesson deleted' });
}));

// ─── USERS ────────────────────────────────────────────────────────────────────
router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
}));

router.put('/users/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (typeof req.body.isActive === 'boolean') user.isActive = req.body.isActive;
  if (req.body.role && ['user', 'admin'].includes(req.body.role)) user.role = req.body.role;
  await user.save();
  res.json({ success: true, user });
}));

router.delete('/users/:id', asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) { res.status(400); throw new Error('Cannot delete yourself'); }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, message: 'User deleted' });
}));

module.exports = router;
