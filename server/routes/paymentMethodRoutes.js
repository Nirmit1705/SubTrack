const express = require('express');
const router = express.Router();
const PaymentMethod = require('../models/PaymentMethod');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/payment-methods
// @desc    Get all payment methods for a user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ user: req.user._id });
    res.json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/payment-methods
// @desc    Create a new payment method
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, type, isDefault } = req.body;

    // If this is marked as default, unmark any existing default
    if (isDefault) {
      await PaymentMethod.updateMany(
        { user: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    const paymentMethod = new PaymentMethod({
      user: req.user._id,
      name,
      type,
      isDefault: isDefault || false
    });

    const savedPaymentMethod = await paymentMethod.save();
    res.status(201).json(savedPaymentMethod);
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/payment-methods/:id
// @desc    Update a payment method
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, type, isDefault } = req.body;

    // Find the payment method first
    let paymentMethod = await PaymentMethod.findById(req.params.id);

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    // Check ownership
    if (paymentMethod.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // If this is being marked as default, unmark any existing default
    if (isDefault && !paymentMethod.isDefault) {
      await PaymentMethod.updateMany(
        { user: req.user._id, isDefault: true },
        { isDefault: false }
      );
    }

    // Update the payment method
    paymentMethod = await PaymentMethod.findByIdAndUpdate(
      req.params.id,
      { name, type, isDefault },
      { new: true }
    );

    res.json(paymentMethod);
  } catch (error) {
    console.error('Error updating payment method:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/payment-methods/:id
// @desc    Delete a payment method
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);

    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }

    // Check ownership
    if (paymentMethod.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await paymentMethod.remove();
    res.json({ message: 'Payment method removed' });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/payment-methods/:id
// @desc    Get a specific payment method by ID
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const paymentMethod = await PaymentMethod.findById(req.params.id);
    
    if (!paymentMethod) {
      return res.status(404).json({ message: 'Payment method not found' });
    }
    
    // Check ownership
    if (paymentMethod.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(paymentMethod);
  } catch (error) {
    console.error('Error fetching payment method:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;