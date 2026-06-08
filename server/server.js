const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');
require('dotenv').config();

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error');

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const adminRoutes = require('./routes/admin');
const leadRoutes = require('./routes/leads');
const paymentRoutes = require('./routes/payment');
const investmentRoutes = require('./routes/investments');

// Blog Model for direct routes
const Blog = require('./models/Blog');
const { protect } = require('./middleware/auth');
const { admin } = require('./middleware/admin');
const asyncHandler = require('express-async-handler');

const app = express();
connectDB();

// Security middlewares
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(mongoSanitize());
app.use(xssClean());
app.use(hpp());
app.use(cookieParser());

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 300, // Increased for testing
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://legacy-wealth-mern.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Legacy Wealth API', timestamp: new Date().toISOString() });
});

// DIRECT BLOG ROUTES (NO ROUTER NESTING)
app.get('/api/blogs', asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 });
  res.json({ success: true, count: blogs.length, blogs });
}));

app.post('/api/blogs', protect, admin, asyncHandler(async (req, res) => {
  const { title, description, image } = req.body;
  const blog = await Blog.create({ title, description, image, author: req.user.name || 'Admin' });
  res.status(201).json({ success: true, blog });
}));

app.put('/api/blogs/:id', protect, admin, asyncHandler(async (req, res) => {
  console.log("Direct PUT called for ID:", req.params.id);
  const { title, description, image } = req.body;
  const blog = await Blog.findById(req.params.id.trim());
  if (!blog) { res.status(404); throw new Error('Blog not found'); }
  if (title) blog.title = title;
  if (description) blog.description = description;
  if (image) blog.image = image;
  await blog.save();
  res.json({ success: true, blog });
}));

app.delete('/api/blogs/:id', protect, admin, asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id.trim());
  res.json({ success: true, message: 'Deleted' });
}));

// OTHER ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/investments', investmentRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Legacy Wealth API running on port ${PORT}`);
});
