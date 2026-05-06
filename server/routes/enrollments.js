const express = require('express');
const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/Enrollment');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

const router = express.Router();

// POST /api/enrollments
router.post('/', protect, asyncHandler(async (req, res) => {
  const { courseId, amountPaid } = req.body;

  const course = await Course.findById(courseId);
  if (!course) { res.status(404); throw new Error('Course not found'); }

  const existing = await Enrollment.findOne({ user: req.user._id, course: courseId });
  if (existing) { res.status(400); throw new Error('Already enrolled in this course'); }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + (course.durationDays || 90));

  const enrollment = await Enrollment.create({
    user: req.user._id,
    course: courseId,
    amountPaid: amountPaid ?? (course.discountPrice || course.price),
    enrollmentStatus: 'pending',
    paymentStatus: 'pending',
    expiresAt
  });

  course.enrollmentCount += 1;
  await course.save();

  res.status(201).json({ success: true, enrollment });
}));

// GET /api/enrollments/me
router.get('/me', protect, asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id })
    .populate('course')
    .populate('lastLesson')
    .sort({ enrolledAt: -1 });
  res.json({ success: true, count: enrollments.length, enrollments });
}));

// POST /api/enrollments/:id/complete-lesson
router.post('/:id/complete-lesson', protect, asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) { res.status(404); throw new Error('Enrollment not found'); }
  if (enrollment.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorised'); }
  if (enrollment.enrollmentStatus !== 'active') { res.status(403); throw new Error('Enrollment is not active'); }

  const { lessonId } = req.body;
  if (!lessonId) { res.status(400); throw new Error('lessonId required'); }

  // Add lesson to completedLessons if not already there
  const alreadyDone = enrollment.completedLessons.map(id => id.toString()).includes(lessonId);
  if (!alreadyDone) {
    enrollment.completedLessons.push(lessonId);
  }

  enrollment.lastLesson = lessonId;

  // Recalculate progress
  const totalLessons = await Lesson.countDocuments({ course: enrollment.course });
  enrollment.progressPercent = totalLessons > 0
    ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
    : 0;

  await enrollment.save();
  res.json({ success: true, enrollment });
}));

// PUT /api/enrollments/:id/progress  (legacy — kept for compatibility)
router.put('/:id/progress', protect, asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) { res.status(404); throw new Error('Enrollment not found'); }
  if (enrollment.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorised'); }

  if (typeof req.body.progressPercent === 'number') {
    enrollment.progressPercent = Math.min(100, Math.max(0, req.body.progressPercent));
  }
  await enrollment.save();
  res.json({ success: true, enrollment });
}));

module.exports = router;
