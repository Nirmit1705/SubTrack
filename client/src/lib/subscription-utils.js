import { 
  Music, 
  Video, 
  ShoppingBag, 
  Cloud, 
  Newspaper, 
  BookOpen, 
  Coffee, 
  Gamepad2,
  Dumbbell,
  Globe,
  Tv
} from 'lucide-react';

// List of supported subscription services
export const subscriptionServices = [
  { id: 1, name: 'Netflix', icon: Video, color: 'bg-red-600' },
  { id: 2, name: 'Spotify', icon: Music, color: 'bg-green-600' },
  { id: 3, name: 'Amazon Prime', icon: ShoppingBag, color: 'bg-blue-600' },
  { id: 4, name: 'Disney+', icon: Tv, color: 'bg-blue-700' },
  { id: 5, name: 'iCloud', icon: Cloud, color: 'bg-sky-500' },
  { id: 6, name: 'NYTimes', icon: Newspaper, color: 'bg-gray-600' },
  { id: 7, name: 'Audible', icon: BookOpen, color: 'bg-amber-600' },
  { id: 8, name: 'Starbucks', icon: Coffee, color: 'bg-green-700' },
  { id: 9, name: 'Xbox Game Pass', icon: Gamepad2, color: 'bg-green-600' },
  { id: 10, name: 'Fitness+', icon: Dumbbell, color: 'bg-red-500' },
  { id: 11, name: 'YouTube Premium', icon: Video, color: 'bg-red-500' },
  { id: 12, name: 'HBO Max', icon: Tv, color: 'bg-purple-700' },
  { id: 13, name: 'Other', icon: Globe, color: 'bg-gray-600' },
];

// Get the icon component for a service
export function getServiceIcon(serviceName) {
  const service = subscriptionServices.find(
    (s) => s.name.toLowerCase() === serviceName.toLowerCase()
  );
  return service?.icon || Globe;
}

// Get the background color for a service
export function getServiceColor(serviceName) {
  const service = subscriptionServices.find(
    (s) => s.name.toLowerCase() === serviceName.toLowerCase()
  );
  return service?.color || 'bg-gray-600';
}

// Sample subscription data
export const sampleSubscriptions = [
  {
    id: 1,
    name: 'Netflix',
    price: 14.99,
    nextRenewal: '2023-04-15',
    paymentMethod: 'Credit Card',
  },
  {
    id: 2,
    name: 'Spotify',
    price: 9.99,
    nextRenewal: '2023-04-20',
    paymentMethod: 'PayPal',
  },
  {
    id: 3,
    name: 'Amazon Prime',
    price: 12.99,
    nextRenewal: '2023-05-10',
    paymentMethod: 'Credit Card',
  },
  {
    id: 4,
    name: 'Disney+',
    price: 7.99,
    nextRenewal: '2023-04-28',
    paymentMethod: 'Credit Card',
  },
  {
    id: 5,
    name: 'iCloud',
    price: 2.99,
    nextRenewal: '2023-05-02',
    paymentMethod: 'Apple Pay',
  },
  {
    id: 6,
    name: 'YouTube Premium',
    price: 11.99,
    nextRenewal: '2023-05-15',
    paymentMethod: 'Google Pay',
  },
];