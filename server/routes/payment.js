const express = require('express');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Course = require('../models/Course');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Initialise Razorpay only when keys are present (so app boots without them)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET &&
    !process.env.RAZORPAY_KEY_ID.includes('xxxx')) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// @route   POST /api/payment/order
// Creates a Razorpay order for a course
router.post('/order', protect, asyncHandler(async (req, res) => {
  if (!razorpay) {
    res.status(503);
    throw new Error('Payment gateway not configured. Add Razorpay keys to .env');
  }

  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const amount = (course.discountPrice > 0 ? course.discountPrice : course.price) * 100; // paise

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
    notes: {
      courseId: course._id.toString(),
      userId: req.user._id.toString()
    }
  });

  res.json({
    success: true,
    order,
    keyId: process.env.RAZORPAY_KEY_ID,
    course: { id: course._id, title: course.title }
  });
}));

// @route   POST /api/payment/verify
// Verifies Razorpay signature after checkout
router.post('/verify', protect, asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expected !== razorpay_signature) {
    res.status(400);
    throw new Error('Invalid payment signature');
  }

  res.json({
    success: true,
    message: 'Payment verified. Proceed to create enrollment.',
    paymentId: razorpay_payment_id,
    orderId: razorpay_order_id
  });
}));

module.exports = router;
