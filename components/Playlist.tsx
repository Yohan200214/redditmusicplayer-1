'use client';

import { usePlaylist } from '@/lib/playlist';
import { Trash2, Play } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Playlist() {
  const { items, currentIndex, setCurrentIndex, removeFromPlaylist, clearPlaylist } = usePlaylist();
  const nextIndex = currentIndex >= 0 && items.length > 0 ? (currentIndex + 1) % items.length : -1;

  if (items.length === 0) {
    return (
      <div className="p-12 text-center animate-fadeIn">
        <div className="text-6xl mb-4 animate-pulse-slow">🎵</div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Playlist is empty</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Browse subreddits and add videos to start playing</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-red-200 dark:border-red-900/30 bg-white dark:bg-gray-900 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Playlist ({items.length})</h2>
        <button
          onClick={clearPlaylist}
          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {items.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setCurrentIndex(index)}
            className={`
              reddit-card p-3 cursor-pointer transition-all duration-200 animate-fadeIn
              ${index === currentIndex 
                ? 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 shadow-md' 
                : 'hover:shadow-md'
              }
            `}
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 relative group">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-20 h-14 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {index === currentIndex && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                    <div className="bg-red-600 rounded-full p-1.5 animate-pulse-slow">
                        <Play size={12} className="text-white" fill="white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2 mb-1.5 text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                  <span className="font-medium text-red-500 dark:text-red-400">r/{item.subreddit}</span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-0.5">
                    <span className="text-red-500">▲</span>
                    {item.score.toLocaleString()}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>💬 {item.comments.toLocaleString()}</span>
                </div>
                <div className="flex gap-2">
                  {index === currentIndex && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-medium animate-pulse-slow">
                      Now playing
                    </span>
                  )}
                  {index === nextIndex && index !== currentIndex && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium">
                      Up next
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromPlaylist(item.id);
                }}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                aria-label="Remove from playlist"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

