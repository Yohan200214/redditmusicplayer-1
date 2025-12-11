'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-3.5 py-2 rounded-full border border-white/50 dark:border-white/15 bg-white/80 dark:bg-white/10 text-gray-900 dark:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-out flex items-center gap-2 backdrop-blur-xl"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={16} className="text-red-400" /> : <Moon size={16} className="text-red-500" />}
      <span className="text-sm font-semibold hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </button>
  );
}

