import { usePlaylist } from '@/lib/playlist';
import { Trash2, Play } from 'lucide-react';
import AppleEmptyState from './AppleEmptyState';
import clsx from 'clsx';

interface ApplePlaylistListProps {
  compact?: boolean;
}

export default function ApplePlaylistList({ compact = false }: ApplePlaylistListProps) {
  const { items, currentIndex, setCurrentIndex, removeFromPlaylist, clearPlaylist } = usePlaylist();
  const nextIndex = currentIndex >= 0 && items.length > 0 ? (currentIndex + 1) % items.length : -1;

  if (items.length === 0) {
    return (
      <AppleEmptyState
        icon="🎵"
        title="Playlist is empty"
        description="Browse subreddits and add videos to start playing."
      />
    );
  }

  return (
    <div className="flex flex-col h-full rounded-3xl bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-[0_20px_60px_-45px_rgba(0,0,0,0.8)] overflow-hidden animate-fadeIn">
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/50 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">Playlist</p>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Now Playing ({items.length})</h2>
        </div>
        <button
          onClick={clearPlaylist}
          className="text-sm font-semibold text-red-500 hover:text-red-400 transition-colors px-3 py-1 rounded-full hover:bg-white/80 dark:hover:bg-white/10"
        >
          Clear All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.map((item, index) => {
          const isActive = index === currentIndex;
          const isNext = index === nextIndex && !isActive;
          return (
            <div
              key={item.id}
              onClick={() => setCurrentIndex(index)}
              className={clsx(
                'flex items-center gap-3 px-4 sm:px-5',
                compact ? 'h-14 sm:h-16' : 'h-16 sm:h-[72px]',
                'cursor-pointer border-b border-white/40 dark:border-white/5 transition-all duration-200 ease-out',
                'bg-transparent hover:bg-white/90 dark:hover:bg-white/10 hover:-translate-y-0.5',
                isActive
                  ? 'bg-gradient-to-r from-red-500/10 via-red-600/10 to-red-700/10 border-white/60 dark:border-white/10 shadow-inner'
                  : ''
              )}
              style={{ animationDelay: `${index * 0.03}s` }}
            >
              <div className="relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-14 h-14 object-cover rounded-2xl shadow-md"
                />
                {isActive && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-black/20 to-black/40 flex items-center justify-center">
                    <div className="bg-white/90 text-red-500 rounded-full p-1.5 shadow">
                      <Play size={12} fill="currentColor" />
                    </div>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span className="text-red-400 font-medium">r/{item.subreddit}</span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center gap-0.5">
                    <span className="text-red-400">▲</span>
                    {item.score.toLocaleString()}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span>💬 {item.comments.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isActive && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-semibold">Now</span>
                )}
                {isNext && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/70 dark:bg-white/10 text-gray-700 dark:text-gray-100 font-semibold">
                    Up next
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromPlaylist(item.id);
                  }}
                  className="p-2 rounded-full hover:bg-white/80 dark:hover.bg-white/10 text-gray-500 hover:text-red-500 transition-all duration-200 ease-out"
                  aria-label="Remove from playlist"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


