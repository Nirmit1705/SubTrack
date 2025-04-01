const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Payment method name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_account', 'paypal', 'apple_pay', 'google_pay', 'other'],
    default: 'credit_card'
  },
  lastFourDigits: {
    type: String,
    minlength: 4,
    maxlength: 4
  },
  expiryDate: {
    type: Date
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);