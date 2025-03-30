import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function DashboardNavbar() {
  const [notifications, setNotifications] = useState(3);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-30 w-full border-b border-gray-800 bg-gray-900/80 backdrop-blur-md"
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold mr-2">
              S
            </div>
            <span className="text-xl font-bold text-white hidden md:inline-block">
              Sub<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Track</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative hover:bg-gray-800 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-300" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                {notifications}
              </span>
            )}
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-200 hidden sm:inline-block">
                  John Doe
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-gray-700 bg-gray-900 text-gray-300">
              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem className="hover:bg-gray-800 cursor-pointer text-red-400 hover:text-red-300">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}