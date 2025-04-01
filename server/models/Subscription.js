const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Subscription name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  renewalDate: {
    type: Date,
    required: [true, 'Renewal date is required']
  },
  category: {
    type: String,
    enum: [
      'entertainment',
      'productivity',
      'utilities',
      'education',
      'music',
      'gaming',
      'shopping',
      'fitness',
      'news',
      'other'
    ],
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
  paymentMethod: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'quarterly', 'weekly'],
    default: 'monthly'
  },
  reminderEnabled: {
    type: Boolean,
    default: true
  },
  reminderDaysBefore: {
    type: Number,
    default: 3
  }
}, { timestamps: true });

// Virtual for annual cost
SubscriptionSchema.virtual('annualCost').get(function() {
  if (this.billingCycle === 'monthly') {
    return this.price * 12;
  } else if (this.billingCycle === 'yearly') {
    return this.price;
  } else if (this.billingCycle === 'quarterly') {
    return this.price * 4;
  } else if (this.billingCycle === 'weekly') {
    return this.price * 52;
  }
  return this.price * 12; // Default to monthly
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);