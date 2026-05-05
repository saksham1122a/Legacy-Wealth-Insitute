const express = require('express');
const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/enrollments
// Create enrollment after successful payment (or free enroll for v1)
router.post('/', protect, asyncHandler(async (req, res) => {
  const { courseId, paymentId, orderId, amountPaid } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check duplicate
  const existing = await Enrollment.findOne({ user: req.user._id, course: courseId });
  if (existing) {
    res.status(400);
    throw new Error('Already enrolled in this course');
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (course.durationDays || 90));

  const enrollment = await Enrollment.create({
    user: req.user._id,
    course: courseId,
    amountPaid: amountPaid ?? (course.discountPrice || course.price),
    paymentStatus: paymentId ? 'success' : 'pending',
    paymentId: paymentId || '',
    orderId: orderId || '',
    expiresAt
  });

  // Bump course count
  course.enrollmentCount += 1;
  await course.save();

  res.status(201).json({ success: true, enrollment });
}));

// @route   GET /api/enrollments/me
router.get('/me', protect, asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id })
    .populate('course')
    .sort({ enrolledAt: -1 });

  res.json({ success: true, count: enrollments.length, enrollments });
}));

// @route   PUT /api/enrollments/:id/progress
router.put('/:id/progress', protect, asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }
  if (enrollment.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorised');
  }

  const { moduleId, progressPercent } = req.body;
  if (moduleId && !enrollment.completedModules.includes(moduleId)) {
    enrollment.completedModules.push(moduleId);
  }
  if (typeof progressPercent === 'number') {
    enrollment.progressPercent = Math.min(100, Math.max(0, progressPercent));
  }

  await enrollment.save();
  res.json({ success: true, enrollment });
}));

module.exports = router;
