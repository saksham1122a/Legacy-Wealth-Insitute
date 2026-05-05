const express = require('express');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Lead = require('../models/Lead');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// @route   POST /api/leads (public — DM LEGACY style capture form)
router.post('/', [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid Indian mobile required')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array().map(e => e.msg).join(', '));
  }

  const lead = await Lead.create(req.body);

  // TODO: trigger WhatsApp/email auto-reply here
  // TODO: forward to CRM (HubSpot, Zoho) via webhook

  res.status(201).json({
    success: true,
    message: "Thanks. We'll reach out within 24 hours.",
    leadId: lead._id
  });
}));

// === ADMIN ===
router.use(protect, admin);

// @route   GET /api/leads
router.get('/', asyncHandler(async (req, res) => {
  const { status, source } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (source) filter.source = source;

  const leads = await Lead.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: leads.length, leads });
}));

// @route   PUT /api/leads/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }
  res.json({ success: true, lead });
}));

// @route   DELETE /api/leads/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error('Lead not found');
  }
  res.json({ success: true, message: 'Lead deleted' });
}));

module.exports = router;
