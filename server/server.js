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
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Legacy Wealth API', timestamp: new Date().toISOString() });
});

// Temporary seed endpoint — will be removed after first run
app.get('/api/run-seed-lw2026', async (req, res) => {
  try {
    const User = require('./models/User');
    const Course = require('./models/Course');

    await User.deleteMany({});
    await Course.deleteMany({});

    await User.create({
      name: 'Sanjeev Sharma',
      email: 'admin@legacywealth.in',
      password: 'LegacyAdmin2026!',
      role: 'admin'
    });

    await Course.insertMany([
      {
        title: 'Smart Money Concepts: 90-Day Mentorship',
        slug: 'smc-90-day-mentorship',
        tagline: 'Trade like the institutions. Stop being their liquidity.',
        description: 'A 90-day live mentorship covering institutional trading logic — Smart Money Concepts, liquidity sweeps, order flow, market structure, and risk management.',
        category: 'Mentorship', level: 'Intermediate',
        price: 75000, discountPrice: 49999, durationDays: 90,
        instructor: 'Sanjeev Sharma', isPublished: true,
        highlights: ['Live weekly mentorship sessions','Real-chart breakdowns','Risk management framework','Private community access','Lifetime recordings','Direct mentor support via WhatsApp'],
        modules: [
          { title: 'Foundation: Why Retail Loses', durationMinutes: 90 },
          { title: 'Market Structure & Liquidity', durationMinutes: 120 },
          { title: 'Order Blocks & Fair Value Gaps', durationMinutes: 110 },
          { title: 'Institutional Entry Models', durationMinutes: 130 },
          { title: 'Risk Management Framework', durationMinutes: 95 },
          { title: 'Trading Psychology & Discipline', durationMinutes: 85 },
          { title: 'Live Trading Sessions (12 weeks)', durationMinutes: 720 }
        ]
      },
      {
        title: 'Investing Foundations: Build Wealth That Lasts',
        slug: 'investing-foundations',
        tagline: 'From your first SIP to your first crore.',
        description: 'A complete foundation course on long-term investing for Indian investors.',
        category: 'Investing', level: 'Beginner',
        price: 12999, discountPrice: 7999, durationDays: 60,
        instructor: 'Sanjeev Sharma', isPublished: true,
        highlights: ['Goal-based investing framework','Asset allocation strategy','Tax planning essentials','Portfolio templates included'],
        modules: [
          { title: 'Money Mindset & Goal Setting', durationMinutes: 60 },
          { title: 'Asset Classes Explained', durationMinutes: 75 },
          { title: 'Portfolio Construction', durationMinutes: 90 },
          { title: 'Tax-Efficient Investing', durationMinutes: 80 }
        ]
      },
      {
        title: 'Forex Foundations: Currency Markets for Indian Traders',
        slug: 'forex-foundations',
        tagline: 'Currency derivatives, hedging, and exchange-listed forex — the legal way.',
        description: 'A compliant introduction to currency trading for Indian residents.',
        category: 'Forex', level: 'Beginner',
        price: 9999, discountPrice: 5999, durationDays: 45,
        instructor: 'Sanjeev Sharma', isPublished: true,
        highlights: ['NSE/BSE compliant content only','Currency hedging for businesses','Macro fundamentals','Risk-first approach'],
        modules: [
          { title: 'Forex Market Structure', durationMinutes: 60 },
          { title: 'INR Currency Derivatives', durationMinutes: 75 },
          { title: 'Hedging Strategies', durationMinutes: 70 },
          { title: 'Macro & Central Banks', durationMinutes: 65 }
        ]
      }
    ]);

    res.json({ success: true, message: 'Database seeded. Admin: admin@legacywealth.in / LegacyAdmin2026!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
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
