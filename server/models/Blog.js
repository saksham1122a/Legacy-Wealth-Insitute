const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Blog description is required'],
  },
  image: {
    type: String, // Base64 or URL
    required: [true, 'Blog image is required'],
  },
  author: {
    type: String,
    default: 'Admin',
  },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
