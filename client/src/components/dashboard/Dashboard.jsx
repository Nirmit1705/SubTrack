import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardNavbar } from './Navbar';
import { SubscriptionCard } from './SubscriptionCard';
import { FloatingButton } from './FloatingButton';
import { AddSubscriptionModal } from './AddSubscriptionModal';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { sampleSubscriptions, getCategoryData, getCategoryColor } from '@/lib/subscription-utils';

export function Dashboard() {
  // State management
  const [showAddModal, setShowAddModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  // Load sample subscriptions on mount
  useEffect(() => {
    // In a real app, you would fetch from API instead
    setSubscriptions(sampleSubscriptions || []);
  }, []);

  // Filter subscriptions based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSubscriptions(subscriptions);
    } else {
      const filtered = subscriptions.filter(sub => 
        sub.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubscriptions(filtered);
    }
  }, [searchQuery, subscriptions]);

  // Calculate summary metrics
  const totalMonthly = filteredSubscriptions.reduce((sum, sub) => sum + sub.price, 0);
  const totalAnnual = totalMonthly * 12;
  
  // Find next upcoming renewal
  const upcomingRenewals = [...filteredSubscriptions]
    .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
    .filter(sub => new Date(sub.renewalDate) >= new Date())
    .slice(0, 1);
  
  const nextRenewal = upcomingRenewals.length > 0 
    ? upcomingRenewals[0]
    : null;

  // Prepare data for pie chart
  const categoryData = getCategoryData(filteredSubscriptions);

  // Calculate percentage of budget used
  const budget = 120; // Example fixed budget
  const percentUsed = Math.min(100, Math.round((totalMonthly / budget) * 100));
  
  // Add new subscription handler
  const handleAddSubscription = (newSubscription) => {
    const updatedSubscriptions = [...subscriptions, {
      ...newSubscription,
      id: Date.now().toString(), // Generate unique ID
    }];
    setSubscriptions(updatedSubscriptions);
    setShowAddModal(false);
  };

  // Delete subscription handler
  const handleDeleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  // Get color based on percentage
  const getBudgetColor = () => {
    if (percentUsed < 50) return 'text-green-500';
    if (percentUsed < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <DashboardNavbar />

      <main className="pt-16 min-h-screen">
        <div className="container mx-auto p-4 md:p-6">
          {/* Hero section with welcome message */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 max-w-7xl mx-auto"
          >
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-gray-400">Track and manage all your subscriptions in one place.</p>
          </motion.div>

          {/* Summary section with 3 cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-7xl mx-auto"
          >
            {/* Monthly Spending + Budget Circle */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Monthly Spending</h3>
                  <p className="text-3xl font-bold text-white mt-2">${totalMonthly.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">of ${budget} budget</p>
                  <p className="mt-3 text-sm text-gray-400">
                    Active Subscriptions: {filteredSubscriptions.length}
                  </p>
                </div>
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
                      strokeDashoffset={251.2 - (251.2 * percentUsed) / 100}
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
                    <p className={`text-lg font-bold ${getBudgetColor()}`}>{percentUsed}%</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className={`text-sm font-medium ${getBudgetColor()}`}>
                  {percentUsed < 50 ? 'Budget on track!' : 
                   percentUsed < 80 ? 'Approaching budget limit' : 
                   'Budget limit exceeded!'}
                </p>
              </div>
            </motion.div>

            {/* Category Pie Chart - Larger and with Legend */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm md:col-span-2 lg:col-span-1"
            >
              <h3 className="text-sm font-medium text-gray-400 mb-4">Spending by Category</h3>
              <div className="h-48 md:h-64">
                {filteredSubscriptions.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={getCategoryColor(entry.name)}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                        labelFormatter={(name) => name.charAt(0).toUpperCase() + name.slice(1)}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        formatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <p className="text-xs">No data to display</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Next Renewal */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-xl border border-amber-900/50 bg-amber-900/10 p-6 backdrop-blur-sm lg:col-span-1 md:col-span-2"
            >
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-amber-400">Next Renewal</h3>
              </div>
              <div className="mt-4">
                {nextRenewal ? (
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <p className="font-medium text-white">{nextRenewal.name}</p>
                      <p className="text-3xl font-bold text-white mt-2">${nextRenewal.price}</p>
                    </div>
                    <div className="mt-6">
                      <p className="text-sm text-amber-200/70">
                        Due on {new Date(nextRenewal.renewalDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-36">
                    <p className="text-amber-200/70">No upcoming renewals</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Subscriptions section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 max-w-7xl mx-auto"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className="text-2xl font-bold">Your Subscriptions</h2>
              
              <div className="flex w-full md:w-auto flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search */}
                <div className="relative flex-grow">
                  <svg 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="search"
                    placeholder="Search subscriptions..."
                    className="pl-10 py-2 bg-gray-800 border border-gray-700 w-full rounded-md text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* View mode switcher */}
                <div className="bg-gray-800 rounded-md flex items-center">
                  <button 
                    className={`px-3 py-2 rounded-l-md ${viewMode === 'grid' ? 'bg-gray-700' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button 
                    className={`px-3 py-2 rounded-r-md ${viewMode === 'list' ? 'bg-gray-700' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Subscription cards */}
            {filteredSubscriptions.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
              >
                {filteredSubscriptions.map((subscription, index) => (
                  <SubscriptionCard 
                    key={subscription.id}
                    subscription={subscription}
                    viewMode={viewMode}
                    onDelete={handleDeleteSubscription}
                    delay={index * 0.05}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 px-4 bg-gray-800/30 rounded-xl border border-gray-700"
              >
                {searchQuery ? (
                  <p className="text-gray-400">No subscriptions match your search. Try a different keyword.</p>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-400">You don't have any subscriptions yet.</p>
                    <button 
                      onClick={() => setShowAddModal(true)}
                      className="px-4 py-2 rounded-md bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                    >
                      Add Your First Subscription
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
      
      {/* Floating action button */}
      <FloatingButton onClick={() => setShowAddModal(true)} />
      
      {/* Add subscription modal */}
      <AddSubscriptionModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSubscription}
      />
    </div>
  );
}