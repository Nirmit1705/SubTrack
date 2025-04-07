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
    enum: ['credit_card', 'debit_card', 'UPI', 'cash'],
    default: 'credit_card'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);