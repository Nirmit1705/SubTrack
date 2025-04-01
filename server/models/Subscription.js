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
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly', 'quarterly'],
    default: 'monthly'
  },
  reminderEnabled: {
    type: Boolean,
    default: true
  },
  reminderDaysBefore: {
    type: Number,
    default: 3,
    min: 0,
    max: 30
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
  }
  return this.price * 12; // Default to monthly
});

// Virtual for next reminder date
SubscriptionSchema.virtual('reminderDate').get(function() {
  if (!this.reminderEnabled) return null;
  
  const reminderDate = new Date(this.renewalDate);
  reminderDate.setDate(reminderDate.getDate() - this.reminderDaysBefore);
  return reminderDate;
});

// Method to check if reminder should be sent today
SubscriptionSchema.methods.shouldSendReminder = function() {
  if (!this.reminderEnabled) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const reminderDate = this.reminderDate;
  reminderDate.setHours(0, 0, 0, 0);
  
  return reminderDate.getTime() === today.getTime();
};

module.exports = mongoose.model('Subscription', SubscriptionSchema);