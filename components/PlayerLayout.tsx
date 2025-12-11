'use client';

import { useEffect, useState } from 'react';
import VideoPlayer from './VideoPlayer';
import { RedditPost } from '@/lib/reddit';
import ToastContainer from './ToastContainer';
import { usePlaylist } from '@/lib/playlist';
import { pushToast } from '@/lib/toast';
import AppleHeader from './AppleHeader';
import ApplePlayer from './ApplePlayer';
import AppleMiniPlayer from './AppleMiniPlayer';
import ApplePlaylistList from './ApplePlaylistList';
import AppleBrowseGrid from './AppleBrowseGrid';
import AppleSidebar from './AppleSidebar';
import AppleNowPlayingPanel from './AppleNowPlayingPanel';
import Comments from './Comments';

interface PlayerLayoutProps {
  initialSubreddit?: string;
  initialPosts?: RedditPost[];
  error?: string | null;
}

type View = 'player' | 'browser' | 'playlist' | 'comments';

export default function PlayerLayout({
  initialSubreddit = 'listentothis',
  initialPosts = [],
  error,
}: PlayerLayoutProps) {
  const [activeView, setActiveView] = useState<View>('player');
  const [controlledSubreddit, setControlledSubreddit] = useState(initialSubreddit);
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
    <div className="min-h-screen bg-gradient-to-br from-[#f8f2e9] via-[#f5e6d6] to-[#f8f2e9] dark:from-[#120c08] dark:via-[#1f140e] dark:to-[#120c08] text-gray-900 dark:text-gray-100 transition-colors duration-300 ease-out">
      <div className="min-h-screen flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-6xl rounded-3xl border border-white/70 dark:border-white/10 bg-white/96 dark:bg-gradient-to-br dark:from-[#1a120c]/90 dark:via-[#1f1410]/92 dark:to-[#24150e]/95 shadow-[0_30px_90px_-45px_rgba(0,0,0,0.55)] backdrop-blur-2xl overflow-hidden animate-fadeIn transition-all duration-300 ease-out">
      <ToastContainer />
          <AppleHeader activeTab={activeView} onChangeTab={setActiveView} onShare={handleShare} />

      {/* Error Message */}
      {error && (
            <div className="max-w-6xl mx-auto px-6">
              <div className="mt-4 rounded-2xl bg-red-100/70 dark:bg-red-900/25 border border-red-300/70 dark:border-red-700/50 px-4 py-3 text-red-800 dark:text-red-200 shadow-sm">
          <p className="font-medium">Error: {error}</p>
              </div>
        </div>
      )}

      {/* Main Content */}
          <div className="px-4 sm:px-6 pb-6 transition-all duration-300 ease-out">
            {activeView === 'player' ? (
              <main className="py-6 animate-fadeIn">
                <ApplePlayer />
              </main>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[260px,1.4fr,360px] gap-4 lg:gap-6 py-6 animate-fadeIn">
                <AppleSidebar
                  activeSubreddit={controlledSubreddit}
                  onSelectSubreddit={(sub) => {
                    setControlledSubreddit(sub);
                    setActiveView('browser');
                  }}
                />
                <div className="space-y-4">
                  <div className="rounded-2xl bg-white/90 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-[0_20px_70px_-45px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_25px_80px_-45px_rgba(0,0,0,0.65)]">
                    {activeView === 'playlist' ? (
                      <ApplePlaylistList />
                    ) : activeView === 'comments' ? (
                      <div className="rounded-2xl overflow-hidden min-h-[640px]">
                        <div className="p-4 border-b border-white/60 dark:border-white/10 flex items-center justify-between">
                          <div>
                            <p className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-500">Comments</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">From current track</p>
                          </div>
                        </div>
                        <div className="h-full overflow-y-auto custom-scroll p-4">
                          <Comments />
                        </div>
                      </div>
                    ) : (
                      <AppleBrowseGrid
                        initialSubreddit={controlledSubreddit}
                        initialPosts={initialPosts}
                        subredditOverride={controlledSubreddit}
                      />
                    )}
                  </div>
              </div>
                <AppleNowPlayingPanel />
              </div>
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
              <div className="pb-24" />
              <AppleMiniPlayer onOpenPlayer={() => setActiveView('player')} />
        </>
      )}
        </div>
      </div>
    </div>
  );
}

