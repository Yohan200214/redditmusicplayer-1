'use client';

import { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import Playlist from './Playlist';
import SubredditBrowser from './SubredditBrowser';
import Comments from './Comments';
import { RedditPost } from '@/lib/reddit';
import { Music, List, MessageSquare, Share2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MiniPlayerBar from './MiniPlayerBar';
import ToastContainer from './ToastContainer';
import { usePlaylist } from '@/lib/playlist';
import { pushToast } from '@/lib/toast';

interface PlayerLayoutProps {
  initialSubreddit?: string;
  initialPosts?: RedditPost[];
  initialSort?: 'hot' | 'new' | 'top' | 'rising';
  error?: string | null;
}

type View = 'player' | 'browser' | 'playlist' | 'comments';

export default function PlayerLayout({
  initialSubreddit = 'listentothis',
  initialPosts = [],
  initialSort = 'hot',
  error,
}: PlayerLayoutProps) {
  const [activeView, setActiveView] = useState<View>('player');
  const [sidebarView, setSidebarView] = useState<View>('browser');
  const { next, previous, togglePlay, setVolume, volume, muted, setMuted, getCurrentItem } = usePlaylist();
  const currentItem = getCurrentItem();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          next();
          break;
        case 'ArrowLeft':
          previous();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(100, volume + 5));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 5));
          break;
        case 'm':
        case 'M':
          setMuted(!muted);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, previous, togglePlay, setVolume, volume, muted, setMuted]);

  const handleShare = async () => {
    try {
      const shareLink = currentItem
        ? `https://reddit.com${currentItem.permalink}`
        : typeof window !== 'undefined'
        ? window.location.href
        : '';
      await navigator.clipboard.writeText(shareLink);
      pushToast('Share link copied', 'success');
    } catch (err) {
      pushToast('Unable to copy link', 'error');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black animate-fadeIn">
      <ToastContainer />
      {/* Header */}
      <header className="bg-white dark:bg-black border-b border-orange-300 dark:border-red-900/50 px-4 py-3 shadow-md sticky top-0 z-30 backdrop-blur-sm bg-white/95 dark:bg-black/95">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <Music className="text-orange-500 dark:text-red-500" size={24} />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Reddit Music Player</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-3 py-2 rounded-lg bg-orange-500 dark:bg-red-600 text-white hover:bg-orange-600 dark:hover:bg-red-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">Share</span>
            </button>
            <ThemeToggle />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <button
            onClick={() => setActiveView('player')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              activeView === 'player'
                ? 'bg-orange-500 dark:bg-red-600 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-red-900/30 hover:text-orange-700 dark:hover:text-white'
            }`}
          >
            Player
          </button>
          <button
            onClick={() => setActiveView('browser')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              activeView === 'browser'
                ? 'bg-orange-500 dark:bg-red-600 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-red-900/30 hover:text-orange-700 dark:hover:text-white'
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => setActiveView('playlist')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              activeView === 'playlist'
                ? 'bg-orange-500 dark:bg-red-600 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-red-900/30 hover:text-orange-700 dark:hover:text-white'
            }`}
          >
            Playlist
          </button>
          <button
            onClick={() => setActiveView('comments')}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
              activeView === 'comments'
                ? 'bg-orange-500 dark:bg-red-600 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-red-900/30 hover:text-orange-700 dark:hover:text-white'
            }`}
          >
            Comments
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 px-4 py-3">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main View */}
        <main className="flex-1 overflow-hidden">
          {activeView === 'player' && <VideoPlayer />}
          {activeView === 'browser' && (
            <SubredditBrowser initialSubreddit={initialSubreddit} initialPosts={initialPosts} />
          )}
          {activeView === 'playlist' && <Playlist />}
          {activeView === 'comments' && <Comments />}
        </main>

        {/* Sidebar */}
        {activeView !== 'player' && (
          <aside className="w-80 border-l border-orange-200 dark:border-red-900/30 bg-gray-50 dark:bg-gray-900 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="p-2 border-b border-orange-200 dark:border-red-900/30 flex gap-2">
                <button
                  onClick={() => setSidebarView('playlist')}
                  className={`flex-1 px-3 py-2 text-sm rounded transition-colors font-medium ${
                    sidebarView === 'playlist'
                      ? 'bg-orange-500 dark:bg-red-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-red-900/30'
                  }`}
                >
                  <List size={16} className="inline mr-1" />
                  Playlist
                </button>
                <button
                  onClick={() => setSidebarView('comments')}
                  className={`flex-1 px-3 py-2 text-sm rounded transition-colors font-medium ${
                    sidebarView === 'comments'
                      ? 'bg-orange-500 dark:bg-red-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-orange-100 dark:hover:bg-red-900/30'
                  }`}
                >
                  <MessageSquare size={16} className="inline mr-1" />
                  Comments
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                {sidebarView === 'playlist' && <Playlist />}
                {sidebarView === 'comments' && <Comments />}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Hidden Video Player - keeps playing in background */}
      {activeView !== 'player' && currentItem && (
        <div className="fixed inset-0 pointer-events-none opacity-0 -z-10">
          <VideoPlayer />
        </div>
      )}

      {/* Mini Player Bar - shown when not in player view */}
      {activeView !== 'player' && currentItem && (
        <>
          <div className="pb-20" />
          <MiniPlayerBar onOpenPlayer={() => setActiveView('player')} />
        </>
      )}
    </div>
  );
}

