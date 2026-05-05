const express = require('express');
const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// @route   GET /api/courses        (public — only published)
router.get('/', asyncHandler(async (req, res) => {
  const { category, level, search } = req.query;
  const filter = { isPublished: true };
  if (category) filter.category = category;
  if (level) filter.level = level;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const courses = await Course.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: courses.length, courses });
}));

// @route   GET /api/courses/:slug  (public)
router.get('/:slug', asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, isPublished: true });
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  res.json({ success: true, course });
}));

// === ADMIN ROUTES ===

// @route   GET /api/courses/admin/all (admin — all courses)
router.get('/admin/all', protect, admin, asyncHandler(async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  res.json({ success: true, count: courses.length, courses });
}));

// @route   POST /api/courses (admin)
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const slug = (req.body.slug || req.body.title || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  const course = await Course.create({ ...req.body, slug });
  res.status(201).json({ success: true, course });
}));

// @route   PUT /api/courses/:id (admin)
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  res.json({ success: true, course });
}));

// @route   DELETE /api/courses/:id (admin)
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  res.json({ success: true, message: 'Course deleted' });
}));

module.exports = router;
