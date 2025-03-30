import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DashboardNavbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { SummaryWidget } from './SummaryWidget';
import { SubscriptionCard } from './SubscriptionCard';
import { FloatingButton } from './FloatingButton';
import { AddSubscriptionModal } from './AddSubscriptionModal';
import { sampleSubscriptions } from '@/lib/subscription-utils';
import { Grid, List, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Dashboard() {
  // State management
  const [showAddModal, setShowAddModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);

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
    .sort((a, b) => new Date(a.nextRenewal) - new Date(b.nextRenewal))
    .slice(0, 1);
  
  const nextRenewal = upcomingRenewals.length > 0 
    ? upcomingRenewals[0]
    : null;

  // Add new subscription handler
  const handleAddSubscription = (newSubscription) => {
    const updatedSubscriptions = [...subscriptions, {
      ...newSubscription,
      id: subscriptions.length + 1, // Generate ID (use UUID in production)
    }];
    setSubscriptions(updatedSubscriptions);
    setShowAddModal(false);
  };

  // Delete subscription handler
  const handleDeleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <DashboardNavbar />
      <Sidebar />

      <main className="ml-0 md:ml-60 pt-16 min-h-screen">
        <div className="container mx-auto p-4 md:p-6 max-w-7xl">
          {/* Hero section with welcome message */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-gray-400">Track and manage all your subscriptions in one place.</p>
          </motion.div>

          {/* Summary widgets */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <SummaryWidget 
              title="Monthly Spending"
              value={`$${totalMonthly.toFixed(2)}`}
              description="Total monthly subscriptions"
              icon="dollar"
              color="from-purple-500 to-purple-700"
            />
            
            <SummaryWidget 
              title="Annual Spending"
              value={`$${totalAnnual.toFixed(2)}`}
              description="Projected yearly cost"
              icon="calendar"
              color="from-blue-500 to-blue-700"
            />
            
            <SummaryWidget 
              title="Next Renewal"
              value={nextRenewal ? nextRenewal.name : "None"}
              description={nextRenewal ? `$${nextRenewal.price} on ${new Date(nextRenewal.nextRenewal).toLocaleDateString()}` : "No upcoming renewals"}
              icon="clock"
              color="from-emerald-500 to-emerald-700"
              isAlert={nextRenewal && new Date(nextRenewal.nextRenewal) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)}
            />
          </motion.div>

          {/* Subscriptions section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
              <h2 className="text-2xl font-bold">Your Subscriptions</h2>
              
              <div className="flex w-full md:w-auto flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search */}
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search subscriptions..."
                    className="pl-10 bg-gray-800 border-gray-700 w-full rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                {/* View mode switcher */}
                <div className="bg-gray-800 rounded-md flex items-center">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-gray-700' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost"
                    size="sm"
                    className={`px-3 py-2 ${viewMode === 'list' ? 'bg-gray-700' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
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
                    onDelete={() => handleDeleteSubscription(subscription.id)}
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
                    <Button 
                      onClick={() => setShowAddModal(true)}
                      className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                    >
                      Add Your First Subscription
                    </Button>
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