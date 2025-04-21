import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Plus, Search, Edit, AlertTriangle, ArrowUp, Calendar, CreditCard, PieChart as PieChartIcon } from 'lucide-react';
import { DashboardNavbar } from '@/components/dashboard/Navbar';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { FloatingButton } from '@/components/dashboard/FloatingButton';
import { AddSubscriptionModal } from '@/components/dashboard/AddSubscriptionModal';
import { EditBudgetModal } from '@/components/dashboard/EditBudgetModal';
import { EditSubscriptionModal } from '@/components/dashboard/EditSubscriptionModal';
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
  const [showEditModal, setShowEditModal] = useState(false); // State for edit modal
  const [subscriptionToEdit, setSubscriptionToEdit] = useState(null); // Subscription being edited
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
  const [userName, setUserName] = useState(''); // Add state for user's name

  // Fetch subscriptions, statistics and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data to retrieve budget
        const userData = await userService.getUser();
        if (userData && userData.budget) {
          setBudget(userData.budget);
        }
        // Set the user's name
        if (userData && userData.name) {
          setUserName(userData.name);
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

  // Add this to the existing useEffect for loading subscriptions
  useEffect(() => {
    const fetchSubscriptionsAndCheckStatus = async () => {
      setIsLoading(true);
      try {
        const fetchedSubscriptions = await subscriptionService.getAllSubscriptions();
        
        // Check and update status for each subscription
        const updatedSubscriptions = await Promise.all(
          fetchedSubscriptions.map(async (sub) => {
            // Check if subscription is expired
            const today = new Date();
            const renewalDate = new Date(sub.renewalDate);
            
            if (renewalDate < today && sub.status === 'active') {
              sub.status = 'expired';
              // Only update in database if needed
              await subscriptionService.updateSubscription(sub._id, sub);
            }
            return sub;
          })
        );
        
        setSubscriptions(updatedSubscriptions);
        setFilteredSubscriptions(updatedSubscriptions);
        
        // Get statistics
        const stats = await subscriptionService.getStatistics();
        setStatistics(stats);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionsAndCheckStatus();
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
      
      // Make sure category and payment method are explicitly included
      const completeSubscription = {
        ...newSubscription,
        // Keep the selected category, fallback to 'other' only if undefined
        category: newSubscription.category || 'other',
        icon: newSubscription.icon || 'globe',
        color: newSubscription.color || '#808080',
        // Ensure payment method is included
        paymentMethod: newSubscription.paymentMethod || 'credit_card',
      };
      
      console.log('Sending to server:', completeSubscription); // Debug log
      
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

  // Handle editing a subscription
  const handleEditSubscription = async (updatedSubscription) => {
    try {
      const result = await subscriptionService.updateSubscription(
        updatedSubscription._id, 
        updatedSubscription
      );
      
      // Update the subscriptions in state
      setSubscriptions(current => 
        current.map(sub => sub._id === result._id ? result : sub)
      );
      
      // Update filtered subscriptions
      setFilteredSubscriptions(current => 
        current.map(sub => sub._id === result._id ? result : sub)
      );
      
      // Close the modal
      setShowEditModal(false);
      
      // Refresh statistics to reflect any price or status changes
      const stats = await subscriptionService.getStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Failed to update subscription. Please try again.');
    }
  };

  // Open edit modal
  const openEditModal = (subscription) => {
    setSubscriptionToEdit(subscription);
    setShowEditModal(true);
  };

  // Delete subscription handler
  const handleDeleteSubscription = async (id) => {
    try {
      console.log("Attempting to delete subscription with ID:", id);
      
      // Check if id is undefined
      if (!id) {
        console.error("Cannot delete subscription: ID is undefined");
        return;
      }
      
      // Call API to delete subscription
      await subscriptionService.deleteSubscription(id);
      
      // Update local state to remove the deleted subscription
      setSubscriptions(prevSubscriptions => 
        prevSubscriptions.filter(sub => (sub._id || sub.id) !== id)
      );
      
      // Update filtered subscriptions
      setFilteredSubscriptions(prevFiltered => 
        prevFiltered.filter(sub => (sub._id || sub.id) !== id)
      );
      
      // Show success message
      alert("Subscription deleted successfully");
      
      // Refresh statistics only if delete was successful
      try {
        const updatedStats = await subscriptionService.getStatistics();
        setStatistics(updatedStats);
      } catch (statsError) {
        console.warn("Failed to refresh statistics:", statsError);
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert("Failed to delete subscription. Please try again.");
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
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs - increased size and intensity */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-[150px] animate-pulse" 
             style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-blue-500/15 rounded-full blur-[130px] animate-pulse" 
             style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-[100px] animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNNjAgMzBjMCAxNi41NjgtMTMuNDMyIDMwLTMwIDMwQzEzLjQzMiA2MCAwIDQ2LjU2OCAwIDMwIDAgMTMuNDMyIDEzLjQzMiAwIDMwIDBjMTYuNTY4IDAgMzAgMTMuNDMyIDMwIDMweiIgc3Ryb2tlPSIjMkQzNzQ4IiBzdHJva2Utd2lkdGg9Ii4yNSIgLz48L2c+PC9zdmc+')] opacity-20"></div>
      </div>

      <DashboardNavbar />

      {/* Updated padding-top to accommodate fixed navbar */}
      <main className="ml-0 pt-20 transition-all duration-300 relative z-10">
        <div className="container mx-auto max-w-6xl p-4 md:p-6">
          {/* Enhanced Hero Section with Greeting - increased gradient effect */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-10 p-6 rounded-2xl bg-gray-800/40 backdrop-blur-lg border border-gray-700/50 relative overflow-hidden shadow-lg shadow-purple-900/10"
          >
            {/* Floating glow effect similar to hero section */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 via-gray-900/40 to-black/30 rounded-2xl"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
              <div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                  Welcome, {userName || 'User'}!
                </h1>
                <p className="mt-2 text-gray-300 max-w-lg">
                  Track your subscriptions, manage your budget, and stay on top of your expenses in one place.
                </p>
              </div>
              <div className="mt-4 md:mt-0 bg-gray-800/50 p-3 rounded-lg backdrop-blur-sm border border-gray-700/50">
                <div className="text-sm text-gray-400">Today's Date</div>
                <div className="text-lg font-medium">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
            </div>
          </motion.div>

          {/* Summary section with enhanced cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Monthly Budget Card - with improved UI */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-lg p-6 cursor-pointer relative group shadow-lg shadow-purple-900/10"
              onClick={() => setShowBudgetModal(true)}
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 rounded-full -mt-10 -mr-10 blur-[30px]"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-500/20 rounded-full -mb-8 -ml-8 blur-[30px]"></div>
              
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <div className="p-2 rounded-lg bg-gray-700/50">
                  <CreditCard className="h-5 w-5 text-purple-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-200">Monthly Budget</h3>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between relative z-10">
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
                      stroke="rgba(255,255,255,0.1)"
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
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#60a5fa" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className={`text-xl font-bold ${getBudgetColor()}`}>{percentUsed}%</p>
                  </div>
                </div>
              </div>
              <p className={`mt-6 text-center text-sm font-medium ${getBudgetColor()}`}>
                {percentUsed < 50 ? 'Under Budget' : 
                percentUsed < 80 ? 'Getting Close' : 
                percentUsed < 100 ? 'Almost at Limit' : 
                'Over Budget!'}
              </p>

              {/* Improved edit overlay */}
              <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="bg-gray-800/80 backdrop-blur-md rounded-full p-4">
                  <Edit className="h-6 w-6 text-purple-400" />
                </div>
                <p className="absolute bottom-6 text-white text-sm font-medium tracking-wide">Edit your budget</p>
              </div>
            </motion.div>

            {/* Category Distribution Card - with improved UI */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-lg p-6 shadow-lg shadow-blue-900/10 relative"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/20 rounded-full -mt-10 -mr-10 blur-[30px]"></div>
              
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <div className="p-2 rounded-lg bg-gray-700/50">
                  <PieChartIcon className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-200">Category Distribution</h3>
              </div>
              
              <div className="h-48 mt-4 relative z-10">
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
                        contentStyle={{ 
                          backgroundColor: 'rgba(31, 41, 55, 0.9)',
                          borderColor: 'rgba(75, 85, 99, 0.3)',
                          borderRadius: '0.5rem',
                        }}
                        itemStyle={{ color: '#e2e8f0' }}
                        labelStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
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

            {/* Next Renewal - with improved UI */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="overflow-hidden rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800/70 to-gray-900/80 backdrop-blur-lg p-6 shadow-lg shadow-amber-900/10 relative"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full -mt-10 -mr-10 blur-[30px]"></div>
              
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <div className="p-2 rounded-lg bg-gray-700/50">
                  <Calendar className="h-5 w-5 text-amber-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-200">Next Renewal</h3>
              </div>
              
              <div className="mt-6 flex items-start gap-3 relative z-10">
                <div className="rounded-lg bg-gray-700/50 p-3">
                  <AlertTriangle className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="font-medium text-white text-lg">{nextRenewal}</p>
                  <p className="mt-2 text-sm text-gray-400">
                    Don't forget to have sufficient funds
                  </p>
                  {upcomingRenewals.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4 p-2 bg-gray-700/50 rounded-lg border border-gray-700/50"
                    >
                      <p className="text-xs text-gray-300">Renews in {Math.ceil((new Date(upcomingRenewals[0].renewalDate) - new Date()) / (1000 * 60 * 60 * 24))} days</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Subscriptions List with improved header */}
          <section className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">Your Subscriptions</h2>
                <p className="text-gray-400 text-sm mt-1">Manage all your active subscriptions</p>
              </div>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* Improved search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search subscription..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-gray-700/50 bg-gray-800/40 pl-10 text-white backdrop-blur-sm sm:w-64 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Improved view mode buttons */}
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-md p-1 border border-gray-700/50">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      className={viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white' 
                        : 'border-0 text-white hover:bg-gray-700 hover:text-white bg-blue-950'}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                      className={viewMode === 'list' 
                        ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white' 
                        : 'border-0 text-white hover:bg-gray-700 hover:text-white bg-blue-950'}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  
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
            </motion.div>

            {/* Subscription cards with improved UI */}
            {isLoading ? (
              <div className="text-center py-16 rounded-xl bg-gray-800/40 backdrop-blur-lg border border-gray-700/50">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                <p className="mt-4 text-gray-300">Loading your subscriptions...</p>
              </div>
            ) : filteredSubscriptions.length > 0 ? (
              <AnimatePresence>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                  className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
                >
                  {filteredSubscriptions.map((subscription, index) => (
                    <motion.div
                      key={subscription._id || subscription.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ 
                        y: -5,
                        boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.1)',
                        transition: { duration: 0.2 } 
                      }}
                    >
                      <SubscriptionCard 
                        subscription={subscription}
                        viewMode={viewMode}
                        onDelete={handleDeleteSubscription}
                        onEdit={openEditModal}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex h-60 flex-col items-center justify-center rounded-xl border border-gray-700/50 bg-gray-800/40 backdrop-blur-lg p-6 text-center"
              >
                <div className="mb-4 rounded-full bg-gray-700/50 p-4">
                  <Search className="h-6 w-6 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-white">No subscriptions found</h3>
                <p className="mt-1 text-gray-400">
                  Try adjusting your search or add a new subscription
                </p>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="mt-6 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subscription
                </Button>
              </motion.div>
            )}
          </section>
        </div>
      </main>

      {/* Modals */}
      <EditBudgetModal
        isOpen={showBudgetModal}
        onClose={() => setShowBudgetModal(false)}
        currentBudget={budget}
        onSave={handleUpdateBudget}
      />
      
      <FloatingButton onClick={() => setShowAddModal(true)} />
      
      <AddSubscriptionModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddSubscription}
      />

      <EditSubscriptionModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        subscription={subscriptionToEdit}
        onSave={handleEditSubscription}
      />
    </div>
  );
}