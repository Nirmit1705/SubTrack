import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import authService from '@/services/authService';

export function AddSubscriptionModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'entertainment',
    renewalDate: '',
    billingCycle: 'monthly',
    icon: 'globe',
    color: '#808080',
    paymentMethod: 'credit_card', // Default payment method
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Add validation
    if (!formData.name || !formData.price || !formData.renewalDate) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Add more fields that the backend expects
    const subscriptionData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
      // Make sure all required fields are present
      billingCycle: formData.billingCycle || 'monthly',
      icon: formData.icon || 'globe',
      color: formData.color || '#808080',
    };
    
    // Call the onAdd prop
    if (typeof onAdd === 'function') {
      onAdd(subscriptionData);
    }
    
    onClose();
    
    // Reset form data
    setFormData({
      name: '',
      price: '',
      category: 'entertainment',
      renewalDate: '',
      billingCycle: 'monthly',
      icon: 'globe',
      color: '#808080',
      paymentMethod: 'credit_card',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gray-900 rounded-xl shadow-xl w-full max-w-md p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Add New Subscription</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                  Subscription Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  placeholder="Netflix, Spotify, etc."
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-1">
                  Price (₹)
                </label>
                <label htmlFor="price" className="block text-sm font-medium text-gray-400 mb-1">
                  Monthly Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className="w-full p-2 pl-8 bg-gray-800 border border-gray-700 rounded-md text-white"
                    placeholder="499"
                    value={formData.price}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-400 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="entertainment">Entertainment</option>
                  <option value="music">Music</option>
                  <option value="productivity">Productivity</option>
                  <option value="utilities">Utilities</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="renewalDate" className="block text-sm font-medium text-gray-400 mb-1">
                  Next Renewal Date *
                </label>
                <input
                  id="renewalDate"
                  name="renewalDate"
                  type="date"
                  required
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  value={formData.renewalDate}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-400 mb-1">
                  Billing Cycle
                </label>
                <select
                  id="billingCycle"
                  name="billingCycle"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  value={formData.billingCycle}
                  onChange={handleChange}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              
              {/* Payment Method Selection - Simplified */}
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-400 mb-1">
                  Payment Method *
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  required
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="cash">Cash</option>
                </select>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-400 mb-1">
                  Website (optional)
                </label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows="2"
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  placeholder="Any additional notes..."
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
              >
                Add Subscription
              </button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}