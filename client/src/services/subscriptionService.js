import api from './api';
import { addMonths, addYears, isBefore } from 'date-fns';

const subscriptionService = {
  getAllSubscriptions: async () => {
    try {
      const response = await api.get('/subscriptions');
      return response.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return []; // Return empty array on error
    }
  },
  
  getSubscription: async (id) => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },
  
  createSubscription: async (subscriptionData) => {
    try {
      console.log('Creating subscription with data:', subscriptionData);
      // Ensure paymentMethod is included in the data being sent
      const completeData = {
        ...subscriptionData,
        paymentMethod: subscriptionData.paymentMethod || 'credit_card',
      };
      
      const response = await api.post('/subscriptions', completeData);
      console.log('Subscription created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },
  
  updateSubscription: async (id, subscriptionData) => {
    try {
      const response = await api.put(`/subscriptions/${id}`, subscriptionData);
      return response.data;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  },
  
  deleteSubscription: async (id) => {
    try {
      const response = await api.delete(`/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  },
  
  getStatistics: async () => {
    try {
      const response = await api.get('/subscriptions/stats/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return {
        totalMonthlySpending: 0,
        totalYearlySpending: 0,
        categorySummary: {}
      };
    }
  },
  
  checkSubscriptionStatus: async (id) => {
    try {
      const subscription = await subscriptionService.getSubscription(id);
      const today = new Date();
      const renewalDate = new Date(subscription.renewalDate);
      
      // If renewal date is before today and status is active, mark as expired
      if (isBefore(renewalDate, today) && subscription.status === 'active') {
        subscription.status = 'expired';
        await subscriptionService.updateSubscription(id, subscription);
      }
      
      return subscription;
    } catch (error) {
      console.error('Error checking subscription status:', error);
      throw error;
    }
  },
  
  renewSubscription: async (id) => {
    try {
      const subscription = await subscriptionService.getSubscription(id);
      const today = new Date();
      let nextRenewalDate;
      
      // Calculate next renewal date based on billing cycle
      switch (subscription.billingCycle) {
        case 'monthly':
          nextRenewalDate = addMonths(today, 1);
          break;
        case 'quarterly':
          nextRenewalDate = addMonths(today, 3);
          break;
        case 'yearly':
          nextRenewalDate = addYears(today, 1);
          break;
        default:
          nextRenewalDate = addMonths(today, 1);
      }
      
      // Update subscription with new renewal date and active status
      const updatedSubscription = {
        ...subscription,
        renewalDate: nextRenewalDate,
        status: 'active'
      };
      
      return await subscriptionService.updateSubscription(id, updatedSubscription);
    } catch (error) {
      console.error('Error renewing subscription:', error);
      throw error;
    }
  }
};

// Delete a subscription
const deleteSubscription = async (id) => {
  try {
    // Debug log
    console.log(`Sending DELETE request for subscription ID: ${id}`);
    
    if (!id) {
      throw new Error("Cannot delete subscription: ID is undefined");
    }
    
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting subscription:', error);
    throw error;
  }
};

export default subscriptionService;