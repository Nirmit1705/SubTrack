import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Plus, Search } from 'lucide-react';
import { DashboardNavbar } from '@/components/dashboard/Navbar';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { SummaryWidget } from '@/components/dashboard/SummaryWidget';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { FloatingButton } from '@/components/dashboard/FloatingButton';
import { AddSubscriptionModal } from '@/components/dashboard/AddSubscriptionModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sampleSubscriptions } from '@/lib/subscription-utils';

export function Dashboard() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubscriptions = sampleSubscriptions.filter(
    (subscription) =>
      subscription.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <DashboardNavbar />
      <Sidebar />
      
      <main className="ml-0 pt-16 md:ml-60 transition-all duration-300">
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

          {/* Summary Widgets */}
          <section className="mb-8">
            <SummaryWidget />
          </section>

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

            {/* Subscription Grid */}
            {filteredSubscriptions.length > 0 ? (
              <motion.div
                layout
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1'
                }`}
              >
                {filteredSubscriptions.map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    subscription={subscription}
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

      <FloatingButton onClick={() => setShowAddModal(true)} />
      
      <AddSubscriptionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  );
}