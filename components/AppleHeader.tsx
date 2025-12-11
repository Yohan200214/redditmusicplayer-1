'use client';

import { useEffect, useState } from 'react';
import { Music, Share2, LogIn } from 'lucide-react';
import { signIn } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';
import AppleTabs from './AppleTabs';

type TabKey = 'player' | 'browser' | 'playlist' | 'comments';

interface AppleHeaderProps {
  activeTab: TabKey;
  onChangeTab: (tab: TabKey) => void;
  onShare: () => void;
}

export default function AppleHeader({ activeTab, onChangeTab, onShare }: AppleHeaderProps) {
  const [showWink, setShowWink] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWink(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/70 dark:bg-black/50 border-b border-white/20 px-5 sm:px-8 py-4 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.8)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white flex items-center justify-center shadow-lg shadow-red-500/25 animate-floatIn">
            <Music size={22} />
            <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs text-white/80 pointer-events-none">
              <span className="w-1.5 h-1.5 bg-white rounded-full" />
              <span
                className={`w-1.5 h-1.5 bg-white rounded-full origin-center inline-block ${
                  showWink ? 'animate-wink' : ''
                }`}
              />
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Reddit</p>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Music Player</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onShare}
            className="px-3 sm:px-4 py-2 rounded-full bg-white/90 dark:bg-white/10 border border-white/40 dark:border-white/15 text-gray-900 dark:text-white shadow-md shadow-black/10 hover:shadow-lg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-white dark:hover:bg-white/15"
          >
            <span className="flex items-center gap-2">
              <Share2 size={16} className="text-red-500" />
              <span className="text-sm font-semibold">Share</span>
            </span>
          </button>
          <button
            onClick={() => signIn('reddit')}
            className="px-3 sm:px-4 py-2 rounded-full bg-white/90 dark:bg-white/10 border border-white/40 dark:border-white/15 text-gray-900 dark:text-white shadow-md shadow-black/10 hover:shadow-lg transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-white dark:hover:bg-white/15"
          >
            <span className="flex items-center gap-2">
              <LogIn size={16} className="text-red-500" />
              <span className="text-sm font-semibold">Login</span>
            </span>
          </button>
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-4 flex justify-center">
        <AppleTabs active={activeTab} onChange={onChangeTab} />
      </div>
    </header>
  );
}
