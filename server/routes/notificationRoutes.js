const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Subscription = require('../models/Subscription');

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

// @desc    Get all notifications for a user
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    // Get current date
    const now = new Date();
    
    // Find notifications that are scheduled for now or earlier
    const notifications = await Notification.find({ 
      user: req.user._id,
      scheduledFor: { $lte: now }
    })
    .sort({ createdAt: -1 })
    .populate('subscription', 'name icon color');
      
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Check if notification belongs to logged in user
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    notification.read = true;
    await notification.save();
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    // Check if notification belongs to logged in user
    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await Notification.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Notification removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Generate reminders for upcoming subscription renewals
// @route   GET /api/notifications/check-reminders
// @access  Private
router.get('/check-reminders', protect, async (req, res) => {
  try {
    // Find subscriptions with reminder enabled
    const subscriptions = await Subscription.find({ 
      user: req.user._id,
      reminderEnabled: true
    });
    
    const newNotifications = [];
    
    for (const sub of subscriptions) {
      // Calculate reminder date
      const reminderDate = new Date(sub.renewalDate);
      reminderDate.setDate(reminderDate.getDate() - sub.reminderDaysBefore);
      
      // Get current date without time
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Set reminder date without time for comparison
      const reminderDateNoTime = new Date(reminderDate);
      reminderDateNoTime.setHours(0, 0, 0, 0);
      
      // Check if reminder should be created
      if (reminderDateNoTime.getTime() >= today.getTime()) {
        // Check if a reminder notification already exists
        const existingNotification = await Notification.findOne({
          user: req.user._id,
          subscription: sub._id,
          type: 'renewal',
          scheduledFor: {
            $gte: new Date(reminderDateNoTime.setHours(0, 0, 0, 0)),
            $lt: new Date(reminderDateNoTime.setHours(23, 59, 59, 999))
          }
        });
        
        if (!existingNotification) {
          // Create a new notification scheduled for the reminder date
          const notification = await Notification.create({
            user: req.user._id,
            subscription: sub._id,
            title: `Renewal Reminder: ${sub.name}`,
            message: `Your ${sub.name} subscription will renew on ${sub.renewalDate.toLocaleDateString()}.`,
            type: 'renewal',
            scheduledFor: reminderDate
          });
          
          newNotifications.push(notification);
        }
      }
    }
    
    res.json({
      message: `${newNotifications.length} new reminders scheduled`,
      notifications: newNotifications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get count of unread notifications
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', protect, async (req, res) => {
  try {
    // Get current date
    const now = new Date();
    
    // Count unread notifications that are scheduled for now or earlier
    const count = await Notification.countDocuments({ 
      user: req.user._id,
      read: false,
      scheduledFor: { $lte: now }
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;