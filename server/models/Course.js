const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  durationMinutes: { type: Number, default: 0 },
  videoUrl: { type: String, default: '' }
}, { _id: true });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: 140
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  tagline: { type: String, default: '', maxlength: 200 },
  description: {
    type: String,
    required: [true, 'Course description is required']
  },
  category: {
    type: String,
    enum: ['SMC Trading', 'Investing', 'Forex', 'Mentorship', 'Foundation'],
    default: 'Foundation'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  discountPrice: { type: Number, default: 0, min: 0 },
  durationDays: { type: Number, default: 90 },
  thumbnail: { type: String, default: '' },
  modules: [moduleSchema],
  highlights: [{ type: String }],
  instructor: { type: String, default: 'Sanjeev Sharma' },
  isPublished: { type: Boolean, default: false },
  enrollmentCount: { type: Number, default: 0 }
}, { timestamps: true });

courseSchema.virtual('effectivePrice').get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

courseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
