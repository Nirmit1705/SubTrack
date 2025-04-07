// Use only the most basic icons from lucide-react
import { Video, Music, BookOpen, DollarSign, Globe } from 'lucide-react';

// Subscription services for dropdown
export const subscriptionServices = [
  { id: 1, name: 'Netflix', icon: 'video', color: '#E50914', genre: 'entertainment' },
  { id: 2, name: 'Spotify', icon: 'music', color: '#1DB954', genre: 'music' },
  { id: 3, name: 'YouTube Premium', icon: 'video', color: '#FF0000', genre: 'entertainment' },
  { id: 4, name: 'Coursera', icon: 'book', color: '#2A73CC', genre: 'educational' },
  { id: 5, name: 'Disney+', icon: 'video', color: '#0063e5', genre: 'entertainment' },
  { id: 6, name: 'Amazon Prime', icon: 'shopping', color: '#00A8E1', genre: 'shopping' },
  { id: 7, name: 'Figma', icon: 'pen', color: '#F24E1E', genre: 'productivity' },
  { id: 8, name: 'Slack', icon: 'message', color: '#4A154B', genre: 'productivity' },
  { id: 9, name: 'Dropbox', icon: 'folder', color: '#0061FF', genre: 'productivity' },
  { id: 10, name: 'Fitness+', icon: 'activity', color: '#FF0000', genre: 'fitness' },
  { id: 11, name: 'HBO Max', icon: 'tv', color: '#6A0DAD', genre: 'entertainment' },
  { id: 12, name: 'Other', icon: 'globe', color: '#808080', genre: 'other' },
];

// Sample data for subscriptions
export const sampleSubscriptions = [
  {
    id: 1,
    name: 'Netflix',
    price: 14.99,
    renewalDate: '2023-04-15',
    paymentMethod: 'Visa •••• 4242',
    icon: 'video',
    color: '#E50914',
    genre: 'entertainment'
  },
  {
    id: 2,
    name: 'Spotify',
    price: 9.99,
    renewalDate: '2023-04-20',
    paymentMethod: 'PayPal',
    icon: 'music',
    color: '#1DB954',
    genre: 'music'
  },
  {
    id: 3,
    name: 'YouTube Premium',
    price: 11.99,
    renewalDate: '2023-05-03',
    paymentMethod: 'Mastercard •••• 5555',
    icon: 'video',
    color: '#FF0000',
    genre: 'entertainment'
  },
  {
    id: 4,
    name: 'Coursera',
    price: 49.99,
    renewalDate: '2023-05-10',
    paymentMethod: 'Apple Pay',
    icon: 'book',
    color: '#2A73CC',
    genre: 'educational'
  },
  {
    id: 5,
    name: 'Figma',
    price: 15.00,
    renewalDate: '2023-04-29',
    paymentMethod: 'Visa •••• 4242',
    icon: 'pen',
    color: '#F24E1E',
    genre: 'productivity'
  },
  {
    id: 6,
    name: 'Slack',
    price: 8.00,
    renewalDate: '2023-05-15',
    paymentMethod: 'Mastercard •••• 5555',
    icon: 'message',
    color: '#4A154B',
    genre: 'productivity'
  }
];

// Map string icon names to icon components
export function getIconComponent(iconName) {
  const iconMap = {
    'video': Video,
    'music': Music,
    'book': BookOpen,
    'dollar': DollarSign,
    'globe': Globe
  };
  
  return iconMap[iconName] || Globe;
}

// Get color for a service
export function getServiceColor(name) {
  const service = subscriptionServices.find(s => s.name === name);
  return service?.color || '#808080';
}

// Helper functions for pie chart data
export function getCategoryData(subscriptions) {
  // Group subscriptions by genre and calculate total spending
  const categories = subscriptions.reduce((acc, sub) => {
    const genre = sub.genre || 'other';
    if (!acc[genre]) {
      acc[genre] = 0;
    }
    acc[genre] += sub.price || 0;
    return acc;
  }, {});
  
  // Convert to array format for the pie chart
  return Object.keys(categories).map(genre => ({
    name: genre,
    value: categories[genre]
  }));
}

// Category colors for pie chart
export const categoryColors = {
  'entertainment': '#8B5CF6', // purple
  'music': '#EC4899', // pink
  'educational': '#F59E0B', // amber
  'education': '#F59E0B', // amber
  'productivity': '#3B82F6', // blue
  'shopping': '#F43F5E', // rose
  'fitness': '#FF6B6B',
  'utilities': '#10B981', // green
  'gaming': '#6366F1', // indigo
  'other': '#6B7280' // gray
};

// Get color for a category (KEEP ONLY THIS VERSION)
export function getCategoryColor(category) {
  return categoryColors[category] || categoryColors.other;
}

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calculate monthly cost based on billing cycle
export const calculateMonthlyCost = (price, billingCycle) => {
  if (billingCycle === 'yearly') {
    return price / 12;
  } else if (billingCycle === 'quarterly') {
    return price / 3;
  } else {
    return price; // monthly
  }
};
// Format price in INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};