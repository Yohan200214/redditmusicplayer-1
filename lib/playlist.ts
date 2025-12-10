import { create } from 'zustand';
import { RedditPost } from './reddit';
import { youtubeService } from './youtube';

export interface PlaylistItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  post: RedditPost;
  subreddit: string;
  score: number;
  comments: number;
  permalink: string;
}

interface PlaylistState {
  items: PlaylistItem[];
  currentIndex: number;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  addToPlaylist: (post: RedditPost) => void;
  addMultipleToPlaylist: (posts: RedditPost[]) => void;
  removeFromPlaylist: (id: string) => void;
  clearPlaylist: () => void;
  setCurrentIndex: (index: number) => void;
  next: () => void;
  previous: () => void;
  setIsPlaying: (playing: boolean) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  getCurrentItem: () => PlaylistItem | null;
  getNextItem: () => PlaylistItem | null;
  shuffle: () => void;
}

export const usePlaylist = create<PlaylistState>((set, get) => ({
  items: [],
  currentIndex: -1,
  isPlaying: false,
  volume: 100,
  muted: false,

  addToPlaylist: (post: RedditPost) => {
    const youtubeLinks = youtubeService.extractYouTubeLinks(post);
    if (youtubeLinks.length === 0) return;

    const videoId = youtubeLinks[0];
    const existingItems = get().items;

    // Check if already in playlist
    if (existingItems.some((item) => item.id === post.id)) {
      return;
    }

    const newItem: PlaylistItem = {
      id: post.id,
      videoId,
      title: post.title,
      thumbnail: youtubeService.getThumbnailUrl(videoId),
      post,
      subreddit: post.subreddit,
      score: post.score,
      comments: post.num_comments,
      permalink: post.permalink,
    };

    set((state) => ({
      items: [...state.items, newItem],
      currentIndex: state.currentIndex === -1 ? 0 : state.currentIndex,
    }));
  },

  addMultipleToPlaylist: (posts: RedditPost[]) => {
    const postsWithYouTube = youtubeService.filterPostsWithYouTube(posts);
    const existingIds = new Set(get().items.map((item) => item.id));
    const newItems: PlaylistItem[] = [];

    for (const post of postsWithYouTube) {
      if (existingIds.has(post.id)) continue;

      const youtubeLinks = youtubeService.extractYouTubeLinks(post);
      if (youtubeLinks.length === 0) continue;

      const videoId = youtubeLinks[0];
      newItems.push({
        id: post.id,
        videoId,
        title: post.title,
        thumbnail: youtubeService.getThumbnailUrl(videoId),
        post,
        subreddit: post.subreddit,
        score: post.score,
        comments: post.num_comments,
        permalink: post.permalink,
      });
    }

    if (newItems.length > 0) {
      set((state) => ({
        items: [...state.items, ...newItems],
        currentIndex: state.currentIndex === -1 ? 0 : state.currentIndex,
      }));
    }
  },

  removeFromPlaylist: (id: string) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      let newIndex = state.currentIndex;

      if (state.currentIndex >= newItems.length) {
        newIndex = newItems.length > 0 ? newItems.length - 1 : -1;
      } else if (state.currentIndex > newItems.findIndex((item) => item.id === id)) {
        newIndex = state.currentIndex - 1;
      }

      return {
        items: newItems,
        currentIndex: newIndex,
      };
    });
  },

  clearPlaylist: () => {
    set({
      items: [],
      currentIndex: -1,
      isPlaying: false,
    });
  },

  setCurrentIndex: (index: number) => {
    const items = get().items;
    if (index >= 0 && index < items.length) {
      set({ currentIndex: index });
    }
  },

  next: () => {
    const state = get();
    if (state.items.length === 0) return;

    const nextIndex = (state.currentIndex + 1) % state.items.length;
    set({ currentIndex: nextIndex });
  },

  previous: () => {
    const state = get();
    if (state.items.length === 0) return;

    const prevIndex = state.currentIndex <= 0 ? state.items.length - 1 : state.currentIndex - 1;
    set({ currentIndex: prevIndex });
  },

  setIsPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  togglePlay: () => {
    const state = get();
    set({ isPlaying: !state.isPlaying });
  },

  setVolume: (volume: number) => {
    set({ volume: Math.max(0, Math.min(100, volume)) });
  },

  setMuted: (muted: boolean) => {
    set({ muted });
  },

  getCurrentItem: () => {
    const state = get();
    if (state.currentIndex >= 0 && state.currentIndex < state.items.length) {
      return state.items[state.currentIndex];
    }
    return null;
  },

  getNextItem: () => {
    const state = get();
    if (state.items.length === 0) return null;
    const nextIndex = (state.currentIndex + 1) % state.items.length;
    return state.items[nextIndex];
  },

  shuffle: () => {
    const state = get();
    const shuffled = [...state.items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const currentItem = state.currentIndex >= 0 ? state.items[state.currentIndex] : null;
    const newIndex = currentItem ? shuffled.findIndex((item) => item.id === currentItem.id) : 0;

    set({
      items: shuffled,
      currentIndex: newIndex >= 0 ? newIndex : 0,
    });
  },
}));

