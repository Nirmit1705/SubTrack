import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoginModal } from '@/components/LoginModal';
import { SignupModal } from '@/components/SignupModal';

export function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800/50"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and site name */}
          <div className="flex items-center">
            <div className="flex items-center">
              {/* Logo icon */}
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold mr-2">
                S
              </div>
              
              {/* Site name */}
              <span className="text-xl font-bold text-white">
                Sub<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Track</span>
              </span>
            </div>
          </div>
          
          {/* Login Button */}
          <Button 
            variant="outline" 
            className="border-gray-700 hover:bg-gray-800 hover:text-white transition-colors"
            onClick={() => setShowLogin(true)}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </div>
      </div>

      {/* Modals */}
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />

      <SignupModal 
        isOpen={showSignup} 
        onClose={() => setShowSignup(false)} 
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </motion.header>
  );
}