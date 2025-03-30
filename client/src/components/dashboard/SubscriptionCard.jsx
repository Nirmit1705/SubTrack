import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, Edit, MoreVertical, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getServiceIcon, getServiceColor } from '@/lib/subscription-utils';

export function SubscriptionCard({ subscription }) {
  const { name, price, nextRenewal, paymentMethod } = subscription;
  const [isHovered, setIsHovered] = useState(false);
  
  const Icon = getServiceIcon(name);
  const bgColor = getServiceColor(name);
  
  // Format date to "Apr 15, 2023" format
  const formattedDate = new Date(nextRenewal).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm transition-all duration-300"
    >
      <div className="relative p-6">
        {/* Subscription Logo */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div 
              className={`flex h-12 w-12 items-center justify-center rounded-lg ${bgColor}`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-white">{name}</h3>
              <p className="text-2xl font-bold text-white">
                ${parseFloat(price).toFixed(2)}
                <span className="text-xs text-gray-400">/mo</span>
              </p>
            </div>
          </div>

          {/* Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-400 hover:text-white focus:outline-none">
                <MoreVertical className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 border-gray-700 bg-gray-900 text-gray-300">
              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="text-red-400 hover:bg-gray-800 hover:text-red-300 cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Subscription Details */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-800/50 p-3">
            <div className="flex items-center text-gray-400">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="text-xs">Renewal</span>
            </div>
            <p className="mt-1 text-sm font-medium text-white">{formattedDate}</p>
          </div>
          <div className="rounded-lg bg-gray-800/50 p-3">
            <div className="flex items-center text-gray-400">
              <CreditCard className="mr-2 h-4 w-4" />
              <span className="text-xs">Payment</span>
            </div>
            <p className="mt-1 text-sm font-medium text-white">
              {paymentMethod}
            </p>
          </div>
        </div>

        {/* Hover Gradient Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 rounded-xl bg-gradient-to-tr from-purple-500/10 to-blue-500/10 pointer-events-none"
        />
      </div>
    </motion.div>
  );
}