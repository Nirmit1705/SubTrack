const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { generateReminderNotifications } = require('../utils/reminderUtils');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  }
  
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// @desc    Get all subscriptions for a user
// @route   GET /api/subscriptions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get a single subscription
// @route   GET /api/subscriptions/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    // Check if subscription belongs to logged in user
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new subscription
// @route   POST /api/subscriptions
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const {
      name,
      price,
      renewalDate,
      category,
      icon,
      color,
      billingCycle,
      reminderEnabled,
      reminderDaysBefore
    } = req.body;
    
    const subscription = await Subscription.create({
      user: req.user._id,
      name,
      price,
      renewalDate,
      category,
      icon,
      color,
      billingCycle,
      reminderEnabled,
      reminderDaysBefore
    });
    
    // Generate reminder notification if enabled
    if (reminderEnabled) {
      await generateReminderNotifications(req.user._id);
    }
    
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a subscription
// @route   PUT /api/subscriptions/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    // Check if subscription belongs to logged in user
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // Generate new reminder notification if needed
    if (updatedSubscription.reminderEnabled) {
      await generateReminderNotifications(req.user._id);
    }
    
    res.json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a subscription
// @route   DELETE /api/subscriptions/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    
    // Check if subscription belongs to logged in user
    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Subscription.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Subscription removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get subscription statistics
// @route   GET /api/subscriptions/stats/summary
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id });
    
    // Calculate total monthly cost
    const totalMonthly = subscriptions.reduce((acc, subscription) => {
      if (subscription.billingCycle === 'monthly') {
        return acc + subscription.price;
      } else if (subscription.billingCycle === 'yearly') {
        return acc + (subscription.price / 12);
      } else if (subscription.billingCycle === 'quarterly') {
        return acc + (subscription.price / 3);
      } else {
        return acc + subscription.price; // Default to monthly
      }
    }, 0);
    
    // Group by category
    const categorySummary = {};
    subscriptions.forEach(subscription => {
      if (!categorySummary[subscription.category]) {
        categorySummary[subscription.category] = 0;
      }
      
      let monthlyCost = subscription.price;
      if (subscription.billingCycle === 'yearly') {
        monthlyCost = subscription.price / 12;
      } else if (subscription.billingCycle === 'quarterly') {
        monthlyCost = subscription.price / 3;
      }
      
      categorySummary[subscription.category] += monthlyCost;
    });
    
    res.json({
      totalSubscriptions: subscriptions.length,
      totalMonthlySpending: totalMonthly,
      totalYearlySpending: totalMonthly * 12,
      categorySummary,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;