'use client';

import { useState, useEffect } from 'react';
import { usePlaylist } from '@/lib/playlist';
import { RedditPost } from '@/lib/reddit';
import { redditService } from '@/lib/reddit';
import { youtubeService } from '@/lib/youtube';
import { Search, Plus, Loader2, Play } from 'lucide-react';
import { pushToast } from '@/lib/toast';
import { formatDistanceToNow } from 'date-fns';

interface SubredditBrowserProps {
  initialSubreddit?: string;
  initialPosts?: RedditPost[];
}

export default function SubredditBrowser({
  initialSubreddit = 'listentothis',
  initialPosts = [],
}: SubredditBrowserProps) {
  const [subreddit, setSubreddit] = useState(initialSubreddit);
  const [posts, setPosts] = useState<RedditPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top' | 'rising'>('hot');
  const { addToPlaylist, addMultipleToPlaylist } = usePlaylist();

  const loadPosts = async (sub: string, sort: typeof sortBy = 'hot') => {
    setLoading(true);
    try {
      const result = await redditService.getSubredditPosts(sub, sort, 25);
      setPosts(result.posts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subreddit) {
      loadPosts(subreddit, sortBy);
    }
  }, [subreddit, sortBy]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const results = await redditService.searchReddit(searchQuery, 25);
      setPosts(results);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAll = () => {
    const postsWithYouTube = youtubeService.filterPostsWithYouTube(posts);
    addMultipleToPlaylist(postsWithYouTube);
    if (postsWithYouTube.length > 0) {
      pushToast(`Added ${postsWithYouTube.length} videos to playlist`, 'success');
    } else {
      pushToast('No YouTube videos found in this list', 'info');
    }
  };

  const filteredPosts = youtubeService.filterPostsWithYouTube(posts);

  const renderSkeletons = () => (
    <div className="space-y-3 p-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="reddit-card p-4 animate-pulse" style={{ animationDelay: `${idx * 0.1}s` }}>
          <div className="flex gap-4">
            <div className="w-28 h-20 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 dark:from-red-900/30 dark:to-red-800/30" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search and Controls */}
      <div className="p-4 border-b border-orange-200 dark:border-red-900/30 bg-white dark:bg-gray-900 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search Reddit or enter subreddit..."
            className="flex-1 px-4 py-2 border border-orange-300 dark:border-red-900/30 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-red-600"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-orange-500 dark:bg-red-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-red-700 transition-colors"
          >
            <Search size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loadPosts(subreddit, sortBy)}
            placeholder="Subreddit name"
            className="flex-1 px-4 py-2 border border-orange-300 dark:border-red-900/30 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-red-600"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 border border-orange-300 dark:border-red-900/30 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-red-600"
          >
            <option value="hot">Hot</option>
            <option value="new">New</option>
            <option value="top">Top</option>
            <option value="rising">Rising</option>
          </select>
        </div>

        {filteredPosts.length > 0 && (
          <button
            onClick={handleAddAll}
            className="w-full px-4 py-2 bg-orange-500 dark:bg-red-600 text-white rounded-lg hover:bg-orange-600 dark:hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            Add All YouTube Videos ({filteredPosts.length})
          </button>
        )}
      </div>

      {/* Posts List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          renderSkeletons()
        ) : posts.length === 0 ? (
          <div className="p-12 text-center animate-fadeIn">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No posts found</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Try a different subreddit or search term</p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {posts.map((post, index) => {
              const youtubeLinks = youtubeService.extractYouTubeLinks(post);
              const hasYouTube = youtubeLinks.length > 0;
              const videoId = hasYouTube ? youtubeLinks[0] : null;
              const thumbnailUrl = videoId 
                ? youtubeService.getThumbnailUrl(videoId, 'high')
                : (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' ? post.thumbnail : null);
              
              return (
                <div
                  key={post.id}
                  className={`reddit-card p-4 animate-fadeIn transition-smooth ${
                    !hasYouTube ? 'opacity-60' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 relative group">
                      {thumbnailUrl ? (
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={thumbnailUrl}
                            alt={post.title}
                            className="w-28 h-20 object-cover transition-transform duration-300 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement?.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="w-28 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center"><span class="text-3xl">🎵</span></div>';
                              }
                            }}
                          />
                          {hasYouTube && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="text-white" size={24} />
                            </div>
                          </div>
                          
                          )}
                        </div>
                      ) : (
                        <div className="w-28 h-20 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-red-900/30 dark:to-red-800/30 rounded-lg flex items-center justify-center">
                          <span className="text-3xl">🎵</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-orange-600 dark:hover:text-red-400 transition-colors cursor-pointer">
                        {post.title}
                      </h3>
                      
                      {/* Reddit-style metadata */}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span className="font-medium text-orange-600 dark:text-red-400 hover:underline cursor-pointer">
                          r/{post.subreddit}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="hover:underline cursor-pointer">u/{post.author}</span>
                        <span className="text-gray-400">•</span>
                        <span>{formatDistanceToNow(new Date(post.created_utc * 1000), { addSuffix: true })}</span>
                      </div>
                      
                      {/* Reddit-style stats */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <span className="text-orange-500 dark:text-red-500">▲</span>
                          <span>{post.score.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <span>💬</span>
                          <span>{post.num_comments.toLocaleString()}</span>
                        </div>
                        {hasYouTube && (
                          <button
                            onClick={() => {
                              addToPlaylist(post);
                              pushToast('Added to playlist', 'success');
                            }}
                            className="ml-auto px-4 py-1.5 bg-orange-500 dark:bg-red-600 text-white text-xs font-medium rounded-md hover:bg-orange-600 dark:hover:bg-red-700 transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md transform hover:scale-105"
                          >
                            <Plus size={14} />
                            Add to Playlist
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
