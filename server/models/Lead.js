const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email']
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please use a valid Indian mobile number']
  },
  source: {
    type: String,
    enum: ['Instagram DM', 'Website', 'YouTube', 'Webinar', 'Referral', 'Ad Campaign', 'Other'],
    default: 'Website'
  },
  interest: {
    type: String,
    enum: ['Mentorship', 'SMC Course', 'Forex', 'Investing', 'General'],
    default: 'General'
  },
  message: { type: String, default: '', maxlength: 1000 },
  status: {
    type: String,
    enum: ['new', 'contacted', 'qualified', 'converted', 'lost'],
    default: 'new'
  },
  notes: { type: String, default: '' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
