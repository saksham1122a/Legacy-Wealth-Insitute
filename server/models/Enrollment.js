const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  amountPaid: { type: Number, required: true, min: 0 },
  paymentStatus: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentId: { type: String, default: '' },
  orderId: { type: String, default: '' },
  progressPercent: { type: Number, default: 0, min: 0, max: 100 },
  completedModules: [{ type: mongoose.Schema.Types.ObjectId }],
  enrolledAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
}, { timestamps: true });

// Prevent duplicate active enrollments
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);
