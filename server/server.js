const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI) 
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Define routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/payment-methods', require('./routes/paymentMethodRoutes'));
// Remove notifications route
// app.use('/api/notifications', require('./routes/notificationRoutes'));

// Remove reminder check route
// app.get('/api/system/check-reminders', async (req, res) => {
//   try {
//     const users = await User.find({}).select('_id');
    
//     for (const user of users) {
//       const { generateReminderNotifications } = require('./utils/reminderUtils');
//       await generateReminderNotifications(user._id);
//     }
    
//     res.json({ message: 'Reminder check completed for all users' });
//   } catch (error) {
//     console.error('Error checking reminders:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// Basic route for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// Set port and start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});