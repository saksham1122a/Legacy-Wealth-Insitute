const express = require('express');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30m'
  });
};

const createRefreshTokenString = () => {
  return crypto.randomBytes(64).toString('hex');
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const setRefreshCookie = (res, token) => {
  const secure = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure,
    sameSite: 'Strict',
    path: '/api/auth',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
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

  // create refresh token, store hashed
  const refreshToken = createRefreshTokenString();
  const hashed = hashToken(refreshToken);
  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push({ token: hashed });
  await user.save();

  setRefreshCookie(res, refreshToken);

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

  // create refresh token + persist hashed version
  const refreshToken = createRefreshTokenString();
  const hashed = hashToken(refreshToken);
  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push({ token: hashed });
  await user.save();

  setRefreshCookie(res, refreshToken);

  res.json({
    success: true,
    user,
    token: generateToken(user._id)
  });
}));

// @route POST /api/auth/refresh
router.post('/refresh', asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error('No refresh token');
  }

  const hashed = hashToken(token);
  const user = await User.findOne({ 'refreshTokens.token': hashed });
  if (!user) {
    res.status(401);
    throw new Error('Invalid refresh token');
  }

  // rotation: remove the old hashed token and add a new one
  user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== hashed);
  const newRefresh = createRefreshTokenString();
  const newHashed = hashToken(newRefresh);
  user.refreshTokens.push({ token: newHashed });
  await user.save();

  setRefreshCookie(res, newRefresh);

  res.json({ success: true, token: generateToken(user._id) });
}));

// @route POST /api/auth/logout
router.post('/logout', asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    const hashed = hashToken(token);
    const user = await User.findOne({ 'refreshTokens.token': hashed });
    if (user) {
      user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== hashed);
      await user.save();
    }
  }
  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.json({ success: true });
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
