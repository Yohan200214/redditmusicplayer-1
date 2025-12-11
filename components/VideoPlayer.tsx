'use client';

import { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube';
import { usePlaylist } from '@/lib/playlist';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { youtubeService } from '@/lib/youtube';

export default function VideoPlayer() {
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
      // Video ended, play next
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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-red-50 to-white dark:from-black dark:to-gray-900 text-gray-900 dark:text-white animate-fadeIn">
        <div className="text-center max-w-md px-6">
          <div className="text-7xl mb-6 animate-pulse-slow">🎬</div>
          <p className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">No video selected</p>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Browse subreddits and add videos to your playlist to start playing</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            <span>💡</span>
            <span>Tip: Use the Browse tab to discover music from Reddit</span>
          </div>
        </div>
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
    <div className="flex flex-col h-full bg-black animate-fadeIn">
      {/* Video Container */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        <div className="w-full h-full max-w-7xl aspect-video animate-scaleIn">
          <YouTube
            videoId={currentItem.videoId}
            opts={opts}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            className="w-full h-full"
            iframeClassName="w-full h-full"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-900 border-t border-red-200 dark:border-red-900/50 text-gray-900 dark:text-white p-4 shadow-2xl animate-slideIn">
        {/* Video Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white transition-all duration-200">
            {currentItem.title}
          </h3>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="text-red-500 dark:text-red-400 font-medium hover:underline cursor-pointer">
              r/{currentItem.subreddit}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-red-500 dark:text-red-500">▲</span>
              {currentItem.score.toLocaleString()}
            </span>
            <span>💬 {currentItem.comments.toLocaleString()}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={previous}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-all duration-200 text-gray-700 dark:text-white hover:scale-110 active:scale-95"
            aria-label="Previous"
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={handlePlayPause}
            className="p-4 bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl text-white hover:scale-110 active:scale-95"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          <button
            onClick={next}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-all duration-200 text-gray-700 dark:text-white hover:scale-110 active:scale-95"
            aria-label="Next"
          >
            <SkipForward size={24} />
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleMute}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full transition-all duration-200 text-gray-700 dark:text-white hover:scale-110 active:scale-95"
              aria-label={muted ? 'Unmute' : 'Mute'}
            >
            {muted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24 accent-red-500 dark:accent-red-600 transition-all"
            />
            <span className="text-sm w-10 text-right text-gray-700 dark:text-white font-medium">{volume}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

