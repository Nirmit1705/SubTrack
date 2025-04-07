const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  renewalDate: {
    type: Date,
    required: true
  },
  // Add status field to track subscription state
  status: {
    type: String,
    enum: ['active', 'expired', 'canceled'],
    default: 'active'
  },
  category: {
    type: String,
    enum: ['entertainment', 'music', 'productivity', 'utilities', 'education', 'other'],
    default: 'other'
  },
  genre: {
    type: String,
    default: 'other'
  },
  icon: {
    type: String,
    default: 'globe'
  },
  color: {
    type: String,
    default: '#808080'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  website: {
    type: String
  },
  notes: {
    type: String
  },
  paymentMethod: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);