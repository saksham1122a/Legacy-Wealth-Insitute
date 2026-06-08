const express = require('express');
const asyncHandler = require('express-async-handler');
const Blog = require('../models/Blog');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

// GET all blogs
router.get('/', asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json({ success: true, count: blogs.length, blogs });
}));

// Create a blog
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const { title, description, image } = req.body;
  if (!title || !description || !image) {
    res.status(400);
    throw new Error('Please provide title, description and image');
  }
  const blog = await Blog.create({ title, description, image, author: req.user.name || 'Admin' });
  res.status(201).json({ success: true, blog });
}));

// Update a blog - Ensure ID is trimmed and found
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  console.log("Backend received update request for ID:", req.params.id);
  const { title, description, image } = req.body;
  const blog = await Blog.findById(req.params.id.trim());

  if (!blog) {
    res.status(404);
    throw new Error('Blog post not found in database');
  }

  if (title) blog.title = title;
  if (description) blog.description = description;
  if (image) blog.image = image;

  const updatedBlog = await blog.save();
  res.json({ success: true, blog: updatedBlog });
}));

// Delete a blog
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id.trim());
  if (!blog) {
    res.status(404);
    throw new Error('Blog not found');
  }
  res.json({ success: true, message: 'Blog deleted' });
}));

module.exports = router;
