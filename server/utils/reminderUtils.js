const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');

/**
 * Generate renewal reminders for a user's subscriptions
 * @param {String} userId - The user ID to generate reminders for
 * @returns {Array} - Array of created notifications
 */
const generateReminderNotifications = async (userId) => {
  try {
    // Find subscriptions with reminder enabled
    const subscriptions = await Subscription.find({ 
      user: userId,
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
      
      // Check if reminder should be created (for today or future)
      if (reminderDateNoTime.getTime() >= today.getTime()) {
        // Check if a reminder notification already exists
        const existingNotification = await Notification.findOne({
          user: userId,
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
            user: userId,
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
    
    return newNotifications;
  } catch (error) {
    console.error('Error generating reminders:', error);
    return [];
  }
};

module.exports = {
  generateReminderNotifications
};