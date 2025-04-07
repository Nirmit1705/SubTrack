import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Plus, Search, Edit, AlertTriangle, ArrowUp, Calendar } from 'lucide-react';
import { DashboardNavbar } from '@/components/dashboard/Navbar';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { FloatingButton } from '@/components/dashboard/FloatingButton';
import { AddSubscriptionModal } from '@/components/dashboard/AddSubscriptionModal';
import { EditBudgetModal } from '@/components/dashboard/EditBudgetModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import subscriptionService from '@/services/subscriptionService';
import userService from '@/services/userService';
import { getCategoryColor, formatCurrency } from '@/lib/subscription-utils';

// Category data processing function
const getCategoryData = (subscriptions) => {
  // Group subscriptions by category and sum prices
  const categoryMap = {};
  
  subscriptions.forEach(sub => {
    const category = sub.category || 'other';
    if (!categoryMap[category]) {
      categoryMap[category] = 0;
    }
    
    // Handle different billing cycles
    let monthlyAmount = sub.price;
    if (sub.billingCycle === 'yearly') {
      monthlyAmount = sub.price / 12;
    } else if (sub.billingCycle === 'quarterly') {
      monthlyAmount = sub.price / 3;
    }
    
    categoryMap[category] += monthlyAmount;
  });
  
  // Convert the map to an array for the chart
  return Object.keys(categoryMap).map(category => ({
    name: category,
    value: categoryMap[category]
  }));
};

export function Dashboard() {
  // State management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budget, setBudget] = useState(5000); // Default budget for Indian users
  const [subscriptions, setSubscriptions] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [statistics, setStatistics] = useState({
    totalMonthly: 0,
    totalYearly: 0,
    categorySummary: {}
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch subscriptions, statistics and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data to retrieve budget
        const userData = await userService.getUser();
        if (userData && userData.budget) {
          setBudget(userData.budget);
        }
        
        const allSubscriptions = await subscriptionService.getAllSubscriptions();
        const stats = await subscriptionService.getStatistics();
        
        setSubscriptions(allSubscriptions);
        setFilteredSubscriptions(allSubscriptions);
        setStatistics(stats);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
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
  const totalMonthly = statistics.totalMonthlySpending || 
    filteredSubscriptions.reduce((sum, sub) => {
      if (sub.billingCycle === 'yearly') {
        return sum + (sub.price / 12);
      } else if (sub.billingCycle === 'quarterly') {
        return sum + (sub.price / 3);
      }
      return sum + sub.price;
    }, 0);
  
  // Find next upcoming renewal
  const upcomingRenewals = [...filteredSubscriptions]
    .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
    .filter(sub => new Date(sub.renewalDate) >= new Date())
    .slice(0, 1);
  
  const nextRenewal = upcomingRenewals.length > 0 
    ? `${upcomingRenewals[0].name} (${formatCurrency(upcomingRenewals[0].price)}) - ${new Date(upcomingRenewals[0].renewalDate).toLocaleDateString('en-IN')}`
    : "No upcoming renewals";

  // Calculate percentage of budget used
  const percentUsed = Math.min(100, Math.round((totalMonthly / budget) * 100));
  
  // Get color based on percentage
  const getBudgetColor = () => {
    if (percentUsed < 50) return 'text-green-500';
    if (percentUsed < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Handle updating the budget
  const handleUpdateBudget = async (newBudget) => {
    try {
      await userService.updateBudget(newBudget);
      setBudget(newBudget);
      // Show success message
      alert('Budget updated successfully!');
    } catch (error) {
      console.error('Failed to update budget:', error);
      alert('Failed to update budget. Please try again.');
    }
  };
  
  // Handle adding a new subscription
  const handleAddSubscription = async (newSubscription) => {
    try {
      console.log('Creating subscription:', newSubscription);
      const completeSubscription = {
        ...newSubscription,
        icon: newSubscription.icon || 'globe',
        color: newSubscription.color || '#808080'
      };
      
      const createdSubscription = await subscriptionService.createSubscription(completeSubscription);
      console.log('Subscription created successfully:', createdSubscription);
      
      // Update local state with the new subscription
      setSubscriptions([...subscriptions, createdSubscription]);
      
      // Refresh statistics
      const stats = await subscriptionService.getStatistics();
      setStatistics(stats);
      
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Failed to create subscription. Please try again.');
    }
  };

  // Delete subscription handler
  const handleDeleteSubscription = async (id) => {
    try {
      await subscriptionService.deleteSubscription(id);
      setSubscriptions(subscriptions.filter(sub => sub._id !== id));
      // Refresh statistics
      const stats = await subscriptionService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  // Update labelFormatter function for the pie chart
  const labelFormatter = (name) => {
    if (typeof name !== 'string') {
      console.warn('Expected string for category name, got:', typeof name, name);
      return String(name || '');
    }
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Prepare data for pie chart
  const categoryData = getCategoryData(filteredSubscriptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <DashboardNavbar />

      <main className="ml-0 pt-16 transition-all duration-300">
        <div className="container mx-auto max-w-6xl p-4 md:p-6">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              Subscriptions Dashboard
            </h1>
            <p className="mt-1 text-gray-400">
              Manage and track all your subscriptions in one place
            </p>
          </div>

          {/* Summary section with 3 cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8"
          >
            {/* Combined Monthly Budget & Utilization Card - Now Clickable */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm cursor-pointer relative group"
              onClick={() => setShowBudgetModal(true)}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-400">Monthly Budget</h3>
                <span className="rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400">
                  <ArrowUp className="mr-1 inline h-3 w-3" />
                  4.3%
                </span>
              </div>
              
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{formatCurrency(totalMonthly)}</p>
                  <p className="mt-1 text-sm text-gray-400">of {formatCurrency(budget)} budget</p>
                </div>
                <div className="relative h-24 w-24 mt-4 sm:mt-0">
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
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className={`text-xl font-bold ${getBudgetColor()}`}>{percentUsed}%</p>
                  </div>
                </div>
              </div>
              <p className={`mt-2 text-center text-sm font-medium ${getBudgetColor()}`}>
                {percentUsed < 50 ? 'Under Budget 👍' : 
                percentUsed < 80 ? 'Getting Close 👀' : 
                percentUsed < 100 ? 'Almost at Limit ⚠️' : 
                'Over Budget! ❌'}
              </p>
              {/* Edit icon overlay that appears on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-800 rounded-full p-3">
                  <Edit className="h-6 w-6 text-blue-400" />
                </div>
                <p className="absolute bottom-4 text-white text-sm font-medium">Click to edit budget</p>
              </div>
            </motion.div>

            {/* Category Distribution Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900/50 p-6 backdrop-blur-sm"
            >
              <h3 className="text-sm font-medium text-gray-400">Category Distribution</h3>
              <div className="h-48 mt-2">
                {filteredSubscriptions.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
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
                        formatter={(value) => formatCurrency(value)}
                        labelFormatter={labelFormatter}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No subscription data available</p>
                  </div>
                )}
              </div>
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

          {/* Subscriptions List */}
          <section className="mb-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-xl font-bold text-white">Your Subscriptions</h2>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search subscription..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border-gray-700 bg-gray-800 pl-10 text-white sm:w-64"
                  />
                </div>
                
                {/* View Controls */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' 
                      ? 'bg-gray-700 text-white' 
                      : 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' 
                      ? 'bg-gray-700 text-white' 
                      : 'border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white'}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white ml-2"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white hidden md:flex"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                  </Button>
                </div>
              </div>
            </div>

            {/* Subscription cards */}
            {isLoading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="mt-4 text-gray-400">Loading your subscriptions...</p>
              </div>
            ) : filteredSubscriptions.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
                className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
              >
                {filteredSubscriptions.map((subscription, index) => (
                  <SubscriptionCard 
                    key={subscription._id || subscription.id || index}
                    subscription={subscription}
                    viewMode={viewMode}
                    onDelete={handleDeleteSubscription}
                    delay={index * 0.05}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="flex h-60 flex-col items-center justify-center rounded-xl border border-gray-800 bg-gray-900/50 p-6 text-center">
                <div className="mb-4 rounded-full bg-gray-800 p-3">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white">No subscriptions found</h3>
                <p className="mt-1 text-gray-400">
                  Try adjusting your search or add a new subscription
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subscription
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Budget Edit Modal */}
      <EditBudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        currentBudget={budget}
        onSave={handleUpdateBudget}
      />
      
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