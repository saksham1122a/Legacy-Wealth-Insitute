require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');

const sampleCourses = [
  {
    title: 'Smart Money Concepts: 90-Day Mentorship',
    slug: 'smc-90-day-mentorship',
    tagline: 'Trade like the institutions. Stop being their liquidity.',
    description: 'A 90-day live mentorship covering institutional trading logic — Smart Money Concepts, liquidity sweeps, order flow, market structure, and risk management. Designed for serious traders ready to leave indicator-based trading behind.',
    category: 'Mentorship',
    level: 'Intermediate',
    price: 75000,
    discountPrice: 49999,
    durationDays: 90,
    instructor: 'Akshat Jain',
    isPublished: true,
    highlights: [
      'Live weekly mentorship sessions',
      'Real-chart breakdowns from Indian markets',
      'Risk management framework',
      'Private community access',
      'Lifetime recordings',
      'Direct mentor support via WhatsApp'
    ],
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
    description: 'A complete foundation course on long-term investing for Indian investors. Covers asset allocation, equity, debt, gold, real estate, and a goal-based portfolio framework that survives every market cycle.',
    category: 'Investing',
    level: 'Beginner',
    price: 12999,
    discountPrice: 7999,
    durationDays: 60,
    instructor: 'Akshat Jain',
    isPublished: true,
    highlights: [
      'Goal-based investing framework',
      'Asset allocation strategy',
      'Tax planning essentials',
      'Portfolio templates included'
    ],
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
    description: 'A compliant introduction to currency trading for Indian residents. Covers INR currency pairs on NSE/BSE, hedging strategies for exporters and importers, and structural understanding of global forex markets.',
    category: 'Forex',
    level: 'Beginner',
    price: 9999,
    discountPrice: 5999,
    durationDays: 45,
    instructor: 'Akshat Jain',
    isPublished: true,
    highlights: [
      'NSE/BSE compliant content only',
      'Currency hedging for businesses',
      'Macro fundamentals',
      'Risk-first approach'
    ],
    modules: [
      { title: 'Forex Market Structure', durationMinutes: 60 },
      { title: 'INR Currency Derivatives', durationMinutes: 75 },
      { title: 'Hedging Strategies', durationMinutes: 70 },
      { title: 'Macro & Central Banks', durationMinutes: 65 }
    ]
  }
];

const seed = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Course.deleteMany({});

    console.log('👤 Creating admin user...');
    await User.create({
      name: process.env.ADMIN_NAME || 'Akshat Jain',
      email: process.env.ADMIN_EMAIL || 'admin@legacywealth.in',
      password: process.env.ADMIN_PASSWORD || 'LegacyAdmin2026!',
      role: 'admin'
    });

    console.log('📚 Creating sample courses...');
    await Course.insertMany(sampleCourses);

    console.log('\n✅ Seed complete!');
    console.log(`\n   Admin login:`);
    console.log(`   Email:    ${process.env.ADMIN_EMAIL || 'admin@legacywealth.in'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'LegacyAdmin2026!'}\n`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
