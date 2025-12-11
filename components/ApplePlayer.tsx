import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';
import { Pause, Play, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { youtubeService } from '@/lib/youtube';
import { usePlaylist } from '@/lib/playlist';
import AppleEmptyState from './AppleEmptyState';

export default function ApplePlayer() {
  const {
    getCurrentItem,
    next,
    previous,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    muted,
    setMuted,
    getNextItem,
  } = usePlaylist();

  const [player, setPlayer] = useState<any>(null);
  const currentItem = getCurrentItem();
  const nextItem = getNextItem();

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    setPlayer(event.target);
    event.target.setVolume(volume);
    if (muted) {
      event.target.mute();
    }
  };

  const onPlayerStateChange: YouTubeProps['onStateChange'] = (event: YouTubeEvent) => {
    if (event.data === 0) {
      next();
    } else if (event.data === 1) {
      setIsPlaying(true);
    } else if (event.data === 2) {
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (!player || !currentItem) return;
    if (typeof player.playVideo !== 'function' || typeof player.pauseVideo !== 'function') return;
    try {
      if (isPlaying) {
        player.playVideo?.();
      } else {
        player.pauseVideo?.();
      }
    } catch (error) {
      console.error('Error controlling video playback:', error);
    }
  }, [isPlaying, currentItem, player]);

  useEffect(() => {
    if (player && typeof player.setVolume === 'function') {
      try {
        player.setVolume(volume);
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  }, [volume, player]);

  useEffect(() => {
    if (!player) return;
    try {
      if (muted) {
        player.mute?.();
      } else {
        player.unMute?.();
      }
    } catch (error) {
      console.error('Error muting/unmuting:', error);
    }
  }, [muted, player]);

  useEffect(() => {
    if (nextItem) {
      const img = new Image();
      img.src = youtubeService.getThumbnailUrl(nextItem.videoId, 'high');
    }
  }, [nextItem]);

  const handlePlayPause = () => {
    if (!player || typeof player.playVideo !== 'function' || typeof player.pauseVideo !== 'function') return;
    try {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  };

  const handleMute = () => {
    if (!player || typeof player.mute !== 'function' || typeof player.unMute !== 'function') return;
    try {
      if (muted) {
        player.unMute();
        setMuted(false);
      } else {
        player.mute();
        setMuted(true);
      }
    } catch (error) {
      console.error('Error toggling mute:', error);
    }
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0 && muted && player && typeof player.unMute === 'function') {
      try {
        setMuted(false);
        player.unMute();
      } catch (error) {
        console.error('Error unmuting:', error);
      }
    }
  };

  if (!currentItem) {
    return (
      <div className="py-12">
        <AppleEmptyState
          icon="🎬"
          title="No video selected"
          description="Browse subreddits and add videos to your playlist to start playing."
        />
      </div>
    );
  }

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      playsinline: 1,
    },
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="rounded-[32px] bg-gradient-to-br from-black via-gray-900 to-gray-950 border border-white/10 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)] overflow-hidden">
        <div className="relative aspect-video w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40 pointer-events-none" />
          <YouTube
            videoId={currentItem.videoId}
            opts={opts}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            className="w-full h-full"
            iframeClassName="w-full h-full"
          />
        </div>
        <div className="p-6 sm:p-8 text-white space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-semibold leading-tight">{currentItem.title}</h3>
            <div className="text-sm text-gray-300 flex items-center gap-3 flex-wrap">
              <span className="text-red-300 font-semibold">r/{currentItem.subreddit}</span>
              <span className="flex items-center gap-1 text-gray-400">
                <span className="text-red-300">▲</span>
                {currentItem.score.toLocaleString()}
              </span>
              <span className="text-gray-400">💬 {currentItem.comments.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-red-500 via-red-600 to-red-700 animate-pulse-slow" />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={previous}
                className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:shadow-lg hover:scale-105 transition-all duration-200 ease-out"
                aria-label="Previous"
              >
                <SkipBack size={22} />
              </button>
              <button
                onClick={handlePlayPause}
                className="p-4 rounded-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 shadow-lg shadow-red-500/30 hover:shadow-xl hover:scale-105 transition-all duration-200 ease-out"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={26} /> : <Play size={26} />}
              </button>
              <button
                onClick={next}
                className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:shadow-lg hover:scale-105 transition-all duration-200 ease-out"
                aria-label="Next"
              >
                <SkipForward size={22} />
              </button>

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={handleMute}
                  className="p-3 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 hover:shadow-lg hover:scale-105 transition-all duration-200 ease-out"
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  {muted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-28 accent-red-500 bg-transparent"
                />
                <span className="text-sm w-10 text-right text-gray-300 font-medium">{volume}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {nextItem && (
        <div className="rounded-2xl bg-white/70 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl p-4 flex items-center gap-3 shadow-[0_15px_50px_-35px_rgba(0,0,0,0.7)]">
          <img
            src={youtubeService.getThumbnailUrl(nextItem.videoId, 'medium')}
            alt={nextItem.title}
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Up next</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{nextItem.title}</p>
            <p className="text-xs text-red-400 font-medium line-clamp-1">r/{nextItem.subreddit}</p>
          </div>
        </div>
      )}
    </div>
  );
}


