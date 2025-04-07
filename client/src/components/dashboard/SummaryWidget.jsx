import { motion } from 'framer-motion';
import { AlertTriangle, ArrowUp, Calendar, Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/subscription-utils';
import { useEffect, useState } from 'react';

export function SummaryWidget({ 
  totalSpending = 89.97, 
  budget = 100, 
  activeSubscriptions = 6,
  nextRenewal = "Netflix ($14.99) - Tomorrow",
  onEditBudget 
}) {
  // Add state to track updates to props
  const [localPercentUsed, setLocalPercentUsed] = useState(0);

  // Update local state when props change
  useEffect(() => {
    const calculatedPercentage = Math.min(100, Math.round((totalSpending / budget) * 100));
    setLocalPercentUsed(calculatedPercentage);
  }, [totalSpending, budget]); // Explicitly depend on these props
  
  // Determine color based on percentage
  const getColor = () => {
    if (localPercentUsed < 50) return 'text-green-500';
    if (localPercentUsed < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      {/* Monthly Spending - Now Clickable */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm cursor-pointer relative group"
        onClick={onEditBudget}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-400">Monthly Budget</h3>
          <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
            <ArrowUp className="mr-1 inline h-3 w-3" />
            4.3%
          </span>
        </div>
        <div className="mt-4">
          <p className="text-3xl font-bold text-white">{formatCurrency(totalSpending)}</p>
          <p className="mt-1 text-sm text-gray-400">of {formatCurrency(budget)} budget</p>
        </div>
        
        {/* Edit icon overlay that appears on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-gray-800 rounded-full p-3">
            <Edit className="h-6 w-6 text-blue-400" />
          </div>
          <p className="absolute bottom-4 text-white text-sm font-medium">Click to edit budget</p>
        </div>
      </motion.div>

      {/* Budget Progress */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm"
        key={`budget-progress-${localPercentUsed}`} // Add key to force re-render
      >
        <h3 className="text-sm font-medium text-gray-400">Budget Utilization</h3>
        <div className="mt-6 flex items-center justify-center">
          <div className="relative h-24 w-24">
            {/* Circle background */}
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#2D3748"
                strokeWidth="10"
              />
              {/* Circle progress */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * localPercentUsed) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className={`text-xl font-bold ${getColor()}`}>{localPercentUsed}%</p>
            </div>
          </div>
        </div>
        <p className="mt-2 text-center text-sm text-gray-400">
          Active Subscriptions: {activeSubscriptions}
        </p>
      </motion.div>

      {/* Next Renewal */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="overflow-hidden rounded-xl border border-amber-900/50 bg-amber-900/10 p-6 backdrop-blur-sm"
      >
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-amber-500" />
          <h3 className="ml-2 text-sm font-medium text-amber-400">Next Renewal</h3>
        </div>
        <div className="mt-4 flex items-start gap-3">
          <div className="rounded-full bg-amber-400/20 p-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="font-medium text-white">{nextRenewal}</p>
            <p className="mt-1 text-sm text-amber-200/70">
              Don't forget to have sufficient funds
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}