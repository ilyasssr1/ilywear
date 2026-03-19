'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/10 hover:bg-gray-100 dark:hover:bg-white/20 transition-all group overflow-hidden border border-gray-100 dark:border-white/10"
      aria-label="Toggle Theme"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ y: 20, opacity: 0, rotate: 40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -20, opacity: 0, rotate: -40 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="relative z-10"
        >
          {theme === 'light' ? (
            <Sun className="w-5 h-5 text-accent fill-accent/10" />
          ) : (
            <Moon className="w-5 h-5 text-accent fill-accent/10" />
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}
