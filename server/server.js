const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error');

// Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const adminRoutes = require('./routes/admin');
const leadRoutes = require('./routes/leads');
const paymentRoutes = require('./routes/payment');

// Init
const app = express();
connectDB();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
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
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Temporary seed endpoint
app.get('/api/run-seed-lw2026', async (req, res) => {
  try {
    const User = require('./models/User');
    const Course = require('./models/Course');
    await User.deleteMany({});
    await Course.deleteMany({});
    await User.create({ name: 'Sanjeev Sharma', email: 'admin@legacywealth.in', password: 'LegacyAdmin2026!', role: 'admin' });
    await Course.insertMany([
      { title: 'Smart Money Concepts: 90-Day Mentorship', slug: 'smc-90-day-mentorship', tagline: 'Trade like the institutions.', description: 'A 90-day live mentorship covering institutional trading logic.', category: 'Mentorship', level: 'Intermediate', price: 75000, discountPrice: 49999, durationDays: 90, instructor: 'Sanjeev Sharma', isPublished: true, highlights: ['Live weekly mentorship sessions','Real-chart breakdowns','Risk management framework','Private community access'], modules: [{ title: 'Foundation: Why Retail Loses', durationMinutes: 90 },{ title: 'Market Structure & Liquidity', durationMinutes: 120 },{ title: 'Order Blocks & Fair Value Gaps', durationMinutes: 110 },{ title: 'Risk Management Framework', durationMinutes: 95 }] },
      { title: 'Investing Foundations', slug: 'investing-foundations', tagline: 'From your first SIP to your first crore.', description: 'A complete foundation course on long-term investing.', category: 'Investing', level: 'Beginner', price: 12999, discountPrice: 7999, durationDays: 60, instructor: 'Sanjeev Sharma', isPublished: true, highlights: ['Goal-based investing framework','Asset allocation strategy'], modules: [{ title: 'Money Mindset', durationMinutes: 60 },{ title: 'Asset Classes Explained', durationMinutes: 75 }] },
      { title: 'Forex Foundations', slug: 'forex-foundations', tagline: 'Currency markets the legal way.', description: 'A compliant introduction to currency trading for Indian residents.', category: 'Forex', level: 'Beginner', price: 9999, discountPrice: 5999, durationDays: 45, instructor: 'Sanjeev Sharma', isPublished: true, highlights: ['NSE/BSE compliant','Risk-first approach'], modules: [{ title: 'Forex Market Structure', durationMinutes: 60 },{ title: 'INR Currency Derivatives', durationMinutes: 75 }] }
    ]);
    res.json({ success: true, message: 'Seeded! Admin: admin@legacywealth.in / LegacyAdmin2026!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Legacy Wealth API', timestamp: new Date().toISOString() });
});


// API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/payment', paymentRoutes);

// Error handlers (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Legacy Wealth API running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
