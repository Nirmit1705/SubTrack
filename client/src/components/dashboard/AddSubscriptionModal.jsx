import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, DollarSign, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
} from '@/components/ui/modal';
import { subscriptionServices } from '@/lib/subscription-utils';

export function AddSubscriptionModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    service: '',
    amount: '',
    nextBilling: '',
    paymentMethod: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New subscription:', formData);
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[90%] max-w-[450px] bg-gray-900/90 backdrop-blur-lg border border-gray-700">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <ModalHeader>
          <ModalTitle className="text-2xl font-bold text-white">
            Add New Subscription
          </ModalTitle>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          {/* Service Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Service
            </label>
            <Select 
              name="service" 
              value={formData.service}
              onValueChange={(value) => handleSelectChange('service', value)}
              required
            >
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                {subscriptionServices.map((service) => (
                  <SelectItem 
                    key={service.id} 
                    value={service.name}
                    className="focus:bg-gray-700 focus:text-white"
                  >
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                name="amount"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 text-white pl-10"
                required
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {/* Next Billing Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Next Billing Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                name="nextBilling"
                value={formData.nextBilling}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 text-white pl-10"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
              Payment Method
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Select 
                name="paymentMethod" 
                value={formData.paymentMethod}
                onValueChange={(value) => handleSelectChange('paymentMethod', value)}
                required
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white pl-10">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                  <SelectItem value="Credit Card" className="focus:bg-gray-700 focus:text-white">
                    Credit Card
                  </SelectItem>
                  <SelectItem value="PayPal" className="focus:bg-gray-700 focus:text-white">
                    PayPal
                  </SelectItem>
                  <SelectItem value="Bank Account" className="focus:bg-gray-700 focus:text-white">
                    Bank Account
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <ModalFooter className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
            >
              Add Subscription
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}