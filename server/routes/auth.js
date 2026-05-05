const express = require('express');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  });
};

// @route   POST /api/auth/register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name too short'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be 8+ characters'),
  body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian mobile')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(e => e.msg).join(', '));
  }

  const { name, email, password, phone } = req.body;

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password, phone });

  res.status(201).json({
    success: true,
    user,
    token: generateToken(user._id)
  });
}));

// @route   POST /api/auth/login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Account is deactivated. Contact support.');
  }

  res.json({
    success: true,
    user,
    token: generateToken(user._id)
  });
}));

// @route   GET /api/auth/me
router.get('/me', protect, asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
}));

// @route   PUT /api/auth/me
router.put('/me', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.name) user.name = req.body.name;
  if (req.body.phone) user.phone = req.body.phone;
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  res.json({ success: true, user: updated });
}));

module.exports = router;
