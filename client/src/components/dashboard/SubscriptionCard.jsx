import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, CreditCard, Edit2, Trash2, Globe, Music, Video, BookOpen, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getServiceColor, formatCurrency } from '@/lib/subscription-utils';

// Simple icon mapping
const iconMap = {
  'video': Video,
  'music': Music,
  'book': BookOpen,
  'globe': Globe
};

// Payment method type mapping
const paymentMethodTypeMap = {
  'credit_card': 'Credit Card',
  'debit_card': 'Debit Card',
  'upi': 'UPI',
  'cash': 'Cash'
};

// Function to get display name for payment method type
const getPaymentMethodDisplay = (paymentMethod) => {
  if (!paymentMethod) return 'No payment method';
  
  // For debugging
  console.log('Payment method received:', paymentMethod);
  
  // If it's already one of our display values, return as is
  if (Object.values(paymentMethodTypeMap).includes(paymentMethod)) {
    return paymentMethod;
  }
  
  // Convert from enum value to display name
  return paymentMethodTypeMap[paymentMethod] || paymentMethod;
};

export function SubscriptionCard({ subscription, viewMode = 'grid', onDelete, onEdit, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract properties safely with fallbacks
  const { 
    id, 
    name = 'Unknown', 
    price = 0, 
    renewalDate = new Date(), 
    paymentMethod = 'credit_card', // Provide default here
    icon = 'globe',
    color = '#808080'
  } = subscription || {};
  
  // Ensure payment method is properly extracted
  console.log('Subscription payment method:', paymentMethod);
  
  // Get category value - prioritizing the category field but falling back to genre if needed
  const category = subscription?.category || subscription?.genre || 'other';
  
  // Debug logging
  console.log("Subscription object:", subscription);
  console.log("Category value:", category);
  
  // Normalize category for lookup in our icons map
  const normalizedCategory = category?.toLowerCase() || 'other';
  console.log("Normalized category:", normalizedCategory);
  
  
  // Make sure to use the correct ID property
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${subscription.name}?`)) {
      // Use _id for MongoDB, id as fallback
      const subscriptionId = subscription._id || subscription.id;
      console.log("Deleting subscription with ID:", subscriptionId);
      onDelete(subscriptionId);
    }
  };
  
  // Get the icon component with a simpler fallback
  const IconComponent = iconMap[icon] || Globe;
  
  // Format date
  const formattedDate = new Date(renewalDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
  // Calculate days until renewal
  const daysUntil = Math.ceil((new Date(renewalDate) - new Date()) / (1000 * 60 * 60 * 24));
  
  // Get renewal status text and color
  const getRenewalStatus = () => {
    if (daysUntil < 0) return { text: 'Overdue', color: 'text-red-500' };
    if (daysUntil === 0) return { text: 'Due today', color: 'text-yellow-500' };
    if (daysUntil <= 3) return { text: 'Due soon', color: 'text-yellow-500' };
    return { text: `${daysUntil} days left`, color: 'text-green-500' };
  };
  
  const renewalStatus = getRenewalStatus();
  
  // Get formatted payment method display name
  const displayPaymentMethod = getPaymentMethodDisplay(paymentMethod);
  
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        className="flex items-center justify-between bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: color || getServiceColor(name) }}>
            <IconComponent className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <span className="text-sm capitalize text-gray-400">{category}</span>
          </div>
        </div>
        
        <div className="hidden md:block text-center">
          <div className="font-medium">{formatCurrency(price)}/mo</div>
          <div className="text-xs text-gray-400">{formatCurrency(price * 12)}/year</div>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-gray-400" />
          <span className="text-sm">{formattedDate}</span>
        </div>
        
        <div className="hidden md:block">
          <span className={`text-sm ${renewalStatus.color}`}>{renewalStatus.text}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Added Edit button */}
          <button
            onClick={() => onEdit(subscription)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: color || '#808080' }}
            >
              <IconComponent className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{name}</h3>
              <span className="text-sm capitalize text-gray-400">{category}</span>
            </div>
          </div>
          
          <div className="absolute top-4 right-4 bg-gray-800/60 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full flex items-center">
            <span className="capitalize">{category}</span>
          </div>
        </div>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <div className="text-2xl font-bold">{formatCurrency(price)}</div>
            <div className="text-xs text-gray-400">per month</div>
          </div>
          
          <div className="text-right">
            <div className={`text-sm font-medium ${renewalStatus.color}`}>
              {renewalStatus.text}
            </div>
            <div className="text-xs text-gray-400 mt-1 flex items-center justify-end">
              <CalendarDays className="h-3 w-3 mr-1" />
              {formattedDate}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between border-t border-gray-800 px-5 py-3 bg-gray-800/30">
        <div className="text-xs text-gray-400 flex items-center">
          <CreditCard className="h-3 w-3 mr-2" />
          {displayPaymentMethod}
        </div>
        
        <div className={`flex gap-1 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {onEdit && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={() => onEdit(subscription)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-gray-700"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}