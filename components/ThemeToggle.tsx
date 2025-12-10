'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-lg border border-orange-300 dark:border-red-900/30 bg-white dark:bg-black text-gray-900 dark:text-white hover:bg-orange-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={16} className="text-orange-500" /> : <Moon size={16} className="text-red-500" />}
      <span className="text-sm hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}

