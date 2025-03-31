import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { subscriptionServices } from '@/lib/subscription-utils';

export function AddSubscriptionModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    genre: '',
    renewalDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    icon: '',
    color: ''
  });

  // Extract unique genre values
  const genres = [...new Set(subscriptionServices.map(service => service.genre))];

  // When a service is selected, pre-fill other fields
  const handleServiceSelect = (e) => {
    const selectedService = subscriptionServices.find(
      service => service.name === e.target.value
    );
    
    if (selectedService) {
      setFormData({
        ...formData,
        name: selectedService.name,
        icon: selectedService.icon,
        color: selectedService.color,
        genre: selectedService.genre
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      price: parseFloat(formData.price),
      // Set default icon and genre if not selected
      icon: formData.icon || 'globe',
      genre: formData.genre || 'other'
    });
    // Reset form
    setFormData({
      name: '',
      price: '',
      genre: '',
      renewalDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Credit Card',
      icon: '',
      color: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-gray-800 rounded-lg p-6 max-w-md w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Subscription</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full bg-gray-700 hover:bg-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Service</label>
              <select
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white"
                onChange={handleServiceSelect}
              >
                <option value="">Select a service...</option>
                {subscriptionServices.map(service => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-gray-700 border-gray-600"
                placeholder="Netflix, Spotify, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price ($/month)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="bg-gray-700 border-gray-600"
                placeholder="9.99"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({...formData, genre: e.target.value})}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white"
                required
              >
                <option value="">Select category</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                className="w-full p-2 rounded-md bg-gray-700 border border-gray-600 text-white"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="PayPal">PayPal</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Next Renewal Date</label>
              <Input
                type="date"
                value={formData.renewalDate}
                onChange={(e) => setFormData({...formData, renewalDate: e.target.value})}
                className="bg-gray-700 border-gray-600"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              className="bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Add Subscription
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}