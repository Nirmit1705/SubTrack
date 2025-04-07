import { useState, useEffect } from 'react';
import { X, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addMonths, addYears, isBefore } from 'date-fns';

export function EditSubscriptionModal({ isOpen, onClose, subscription, onSave }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [status, setStatus] = useState('active');
  const [isExpired, setIsExpired] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [billingCycle, setBillingCycle] = useState('monthly');
  
  // Populate fields when the modal opens
  useEffect(() => {
    if (subscription) {
      setName(subscription.name || '');
      setPrice(subscription.price || '');
      setPaymentMethod(subscription.paymentMethod || 'credit_card');
      setBillingCycle(subscription.billingCycle || 'monthly');
      
      // Set renewal date
      if (subscription.renewalDate) {
        const date = new Date(subscription.renewalDate);
        setRenewalDate(format(date, 'yyyy-MM-dd'));
        
        // Check if subscription is expired
        const today = new Date();
        setIsExpired(isBefore(date, today) && subscription.status !== 'canceled');
        setStatus(subscription.status || 'active');
      }
    }
  }, [subscription]);

  // Handle renewal based on billing cycle
  const handleRenewSubscription = () => {
    // Use the current billing cycle state instead of subscription.billingCycle
    if (!billingCycle) return;
    
    let nextRenewalDate;
    const currentDate = new Date();
    
    // Calculate next renewal date based on billing cycle
    switch (billingCycle) {
      case 'monthly':
        nextRenewalDate = addMonths(currentDate, 1);
        break;
      case 'quarterly':
        nextRenewalDate = addMonths(currentDate, 3);
        break;
      case 'yearly':
        nextRenewalDate = addYears(currentDate, 1);
        break;
      default:
        nextRenewalDate = addMonths(currentDate, 1);
    }
    
    setRenewalDate(format(nextRenewalDate, 'yyyy-MM-dd'));
    setStatus('active');
    setIsExpired(false);
  };

  const handleSave = () => {
    onSave({ 
      ...subscription, 
      name, 
      price, 
      renewalDate: new Date(renewalDate),
      status,
      paymentMethod,
      billingCycle
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl w-full max-w-md shadow-lg animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">Edit Subscription</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="price" className="text-sm font-medium text-gray-300">
                Price
              </label>
              <input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            {/* Payment Method Selection - Simplified */}
            <div className="space-y-2">
              <label htmlFor="paymentMethod" className="text-sm font-medium text-gray-300">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="credit_card">Credit Card</option>
                <option value="debit_card">Debit Card</option>
                <option value="upi">UPI</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            
            {/* Billing Cycle Selection */}
            <div className="space-y-2">
              <label htmlFor="billingCycle" className="text-sm font-medium text-gray-300">
                Billing Cycle
              </label>
              <select
                id="billingCycle"
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            {/* Renewal Date Management */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="renewalDate" className="text-sm font-medium text-gray-300">
                  Next Renewal Date
                </label>
                {isExpired && (
                  <span className="text-xs font-medium text-red-400 bg-red-900/20 px-2 py-1 rounded">
                    Expired
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex-grow relative">
                  <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    id="renewalDate"
                    type="date"
                    value={renewalDate}
                    onChange={(e) => {
                      setRenewalDate(e.target.value);
                      const newDate = new Date(e.target.value);
                      const today = new Date();
                      setIsExpired(isBefore(newDate, today));
                      setStatus(isBefore(newDate, today) ? 'expired' : 'active');
                    }}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 pl-10 pr-3 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleRenewSubscription}
                  className="flex items-center gap-1 px-3 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white"
                  title={`Renew for another ${billingCycle}`}
                >
                  <RefreshCw className="h-4 w-4" />
                  Renew
                </button>
              </div>
              <p className="text-xs text-gray-400">
                {isExpired 
                  ? "This subscription has expired. Set a new date or click 'Renew'."
                  : `Next payment due on ${renewalDate ? format(new Date(renewalDate), 'MMMM d, yyyy') : 'unknown date'}`
                }
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-4">
            <Button variant="outline" onClick={onClose} className="border-gray-700 text-gray-300 hover:bg-gray-700">
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}