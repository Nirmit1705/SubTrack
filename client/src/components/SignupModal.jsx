import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal";

export function SignupModal({ isOpen, onClose, onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Use the navigate hook from react-router-dom
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple password validation
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Store user data or auth token
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ name, email }));
      
      // Reset loading state
      setIsLoading(false);
      
      // Close modal
      onClose();
      
      // Navigate to dashboard
      navigate('/dashboard');
    }, 1500); // Simulated API delay
  };

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className="w-[90%] max-w-[340px] p-6">
        <form onSubmit={handleSubmit}>
          <ModalHeader className="pb-2">
            <ModalTitle className="text-2xl mb-2 text-center">Create Account</ModalTitle>
            <ModalDescription className="text-center">
              Sign up to start tracking your subscriptions
            </ModalDescription>
          </ModalHeader>

          <div className="space-y-4 py-5">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Full Name"
                  className="pl-10 bg-gray-800 border-gray-700"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email"
                  className="pl-10 bg-gray-800 border-gray-700"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 bg-gray-800 border-gray-700"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-10 bg-gray-800 border-gray-700"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </>
                )}
              </Button>
            </div>
          </div>

          <ModalFooter className="flex flex-col items-center pt-2 pb-1">
            <div className="text-sm text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-purple-400 hover:text-purple-300 focus:outline-none"
                disabled={isLoading}
              >
                Log In
              </button>
            </div>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}