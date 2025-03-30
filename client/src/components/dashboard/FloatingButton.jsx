import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

export function FloatingButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg transition-all duration-300 hover:shadow-purple-500/30"
    >
      <Plus className="h-6 w-6" />
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 opacity-30 blur group-hover:opacity-70" />
    </motion.button>
  );
}