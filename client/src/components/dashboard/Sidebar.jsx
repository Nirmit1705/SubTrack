import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  ChevronLeft, 
  CreditCard, 
  LayoutDashboard, 
  Plus, 
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Plus, label: 'Add Subscription', active: false },
    { icon: CreditCard, label: 'Payments', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ 
        x: 0, 
        opacity: 1,
        width: isCollapsed ? 80 : 240 
      }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed left-0 top-16 z-20 flex h-[calc(100vh-4rem)] flex-col border-r border-gray-800 bg-gray-900",
        isCollapsed ? "w-20" : "w-60"
      )}
    >
      <div className="flex flex-col gap-2 p-4">
        {navItems.map((item, index) => (
          <NavItem 
            key={index}
            icon={item.icon}
            label={item.label}
            active={item.active}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      <div className="mt-auto p-4">
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center rounded-md border border-gray-700 p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-gray-200"
        >
          <ChevronLeft className={cn(
            "h-5 w-5 transition-transform duration-300",
            isCollapsed && "rotate-180"
          )} />
          {!isCollapsed && <span className="ml-2">Collapse</span>}
        </button>
      </div>
    </motion.aside>
  );
}

function NavItem({ icon: Icon, label, active, isCollapsed }) {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        backgroundColor: "rgba(55, 65, 81, 0.8)"
      }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex cursor-pointer items-center rounded-md p-3 transition-colors",
        active 
          ? "bg-gradient-to-r from-purple-900/40 to-blue-900/40 text-white" 
          : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
      )}
    >
      <div className={cn(
        "flex items-center",
        active
          ? "bg-gradient-to-r from-purple-500 to-blue-500 rounded-md p-2" 
          : ""
      )}>
        <Icon className={cn(
          "h-5 w-5",
          active ? "text-white" : "text-inherit"
        )} />
      </div>
      {!isCollapsed && (
        <span className={cn(
          "ml-3 text-sm font-medium",
          active ? "text-white" : "text-inherit"
        )}>
          {label}
        </span>
      )}
    </motion.div>
  );
}