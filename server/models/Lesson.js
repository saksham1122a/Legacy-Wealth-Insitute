const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  course:      { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  moduleId:    { type: mongoose.Schema.Types.ObjectId, required: true },
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  type:        { type: String, enum: ['video', 'text', 'pdf'], default: 'video' },
  videoUrl:    { type: String, default: '' },
  duration:    { type: Number, default: 0 },
  order:       { type: Number, default: 0 },
  isPreview:   { type: Boolean, default: false },
  content:     { type: String, default: '' },
  resources:   [{ name: String, url: String }]
}, { timestamps: true });

lessonSchema.index({ course: 1, moduleId: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
