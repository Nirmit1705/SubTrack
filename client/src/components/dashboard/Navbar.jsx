import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import userService from '@/services/userService';

export function DashboardNavbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState({ name: 'User' }); // Default value until data is loaded
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getUser();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If API call fails, try to get user from localStorage
        const localUser = JSON.parse(localStorage.getItem('user'));
        if (localUser && localUser.name) {
          setUser(localUser);
        }
      }
    };
    
    fetchUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    try {
      // Clear any user data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Navigate to login page
      navigate('/');
      
      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Get the first letter of the user's name for the avatar
  const getInitial = () => {
    return user && user.name ? user.name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-30 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-md"
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold mr-2">
              S
            </div>
            <span className="text-3xl font-bold text-white hidden md:inline-block">
              Sub<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Track</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center gap-2 hover:bg-gray-800 p-2 rounded-md transition-colors"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white font-medium">{getInitial()}</span>
              </div>
              <span className="text-sm font-medium text-gray-200 hidden sm:inline-block">
                {user.name}
              </span>
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
                <div className="py-1">
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300"
                    onClick={handleLogout}
                  >
                    <svg className="inline-block h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}