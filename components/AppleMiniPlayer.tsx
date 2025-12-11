import { Pause, Play, SkipForward, VolumeX, Volume2 } from 'lucide-react';
import { usePlaylist } from '@/lib/playlist';
import clsx from 'clsx';

interface AppleMiniPlayerProps {
  onOpenPlayer?: () => void;
}

export default function AppleMiniPlayer({ onOpenPlayer }: AppleMiniPlayerProps) {
  const { getCurrentItem, isPlaying, togglePlay, next, muted, setMuted } = usePlaylist();
  const item = getCurrentItem();

  if (!item) return null;

  const handlePlayPause = () => {
    togglePlay();
    if (!isPlaying && onOpenPlayer) {
      onOpenPlayer();
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4">
        <div className="rounded-2xl bg-white/75 dark:bg-black/60 border border-white/40 dark:border-white/10 backdrop-blur-2xl shadow-[0_25px_70px_-35px_rgba(0,0,0,0.8)] animate-slideInUp">
          <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3">
            <div className="relative">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-14 h-14 object-cover rounded-2xl shadow-lg"
              />
              {isPlaying && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-pulse-slow shadow-sm" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
              <p className="text-xs text-red-400 font-medium truncate">r/{item.subreddit}</p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setMuted(!muted)}
                aria-label={muted ? 'Unmute' : 'Mute'}
                className="p-2 rounded-full bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10 text-gray-700 dark:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-out"
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <button
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className={clsx(
                  'p-3 rounded-full text-white shadow-lg shadow-red-500/30 transition-all duration-200 ease-out hover:shadow-xl hover:scale-105',
                  'bg-gradient-to-r from-red-500 via-red-600 to-red-700'
                )}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="p-2 rounded-full bg-white/60 dark:bg-white/10 border border-white/40 dark:border-white/10 text-gray-700 dark:text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-out"
              >
                <SkipForward size={18} />
              </button>
              {onOpenPlayer && (
                <button
                  onClick={onOpenPlayer}
                  className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold rounded-full bg-white/80 dark:bg-white/10 text-gray-900 dark:text-white border border-white/40 dark:border-white/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-out"
                >
                  Open Player
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


