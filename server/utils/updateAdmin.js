require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/User');

const update = async () => {
  try {
    await connectDB();
    const email = process.env.ADMIN_EMAIL || 'admin@legacywealth.in';
    const name = process.env.ADMIN_NAME || 'Saksham Nanda';
    const user = await User.findOneAndUpdate({ email }, { name }, { new: true });
    if (user) {
      console.log(`Updated admin: ${user.email} -> ${user.name}`);
    } else {
      console.log('Admin user not found; creating new admin user');
      const created = await User.create({ name, email, password: process.env.ADMIN_PASSWORD || 'ChangeThisAdminPass2026!', role: 'admin' });
      console.log('Created new admin:', created.email);
    }
    process.exit(0);
  } catch (err) {
    console.error('Failed to update/create admin:', err);
    process.exit(1);
  }
};

update();
