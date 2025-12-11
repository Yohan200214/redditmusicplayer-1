'use client';

import { usePlaylist } from '@/lib/playlist';
import { Pause, Play, SkipForward, VolumeX, Volume2 } from 'lucide-react';

interface MiniPlayerBarProps {
  onOpenPlayer?: () => void;
}

export default function MiniPlayerBar({ onOpenPlayer }: MiniPlayerBarProps) {
  const { getCurrentItem, isPlaying, togglePlay, next, muted, setMuted } = usePlaylist();
  const item = getCurrentItem();

  if (!item) return null;

  const handlePlayPause = () => {
    togglePlay();
    // If not playing and we have onOpenPlayer, switch to player view
    if (!isPlaying && onOpenPlayer) {
      onOpenPlayer();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md text-gray-900 dark:text-white border-t border-red-300 dark:border-red-900/50 px-4 py-3 shadow-2xl animate-slideIn">
      <div className="flex items-center gap-3 max-w-7xl mx-auto">
        <div className="relative group">
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="w-14 h-14 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-110" 
          />
          {isPlaying && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse-slow"></div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">{item.title}</p>
          <p className="text-xs text-red-500 dark:text-red-400 truncate font-medium">r/{item.subreddit}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMuted(!muted)}
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 text-gray-700 dark:text-white hover:scale-110 active:scale-95"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            onClick={handlePlayPause}
            className="p-3 rounded-full hover:bg-red-600 dark:hover:bg-red-700 transition-all duration-200 bg-red-600 dark:bg-red-600 shadow-lg hover:shadow-xl text-white hover:scale-110 active:scale-95"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={() => next()}
            className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 text-gray-700 dark:text-white hover:scale-110 active:scale-95"
            aria-label="Next"
          >
            <SkipForward size={18} />
          </button>
          {onOpenPlayer && (
            <button
              onClick={onOpenPlayer}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 text-white transition-all duration-200 ml-2 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
            >
              Open Player
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

