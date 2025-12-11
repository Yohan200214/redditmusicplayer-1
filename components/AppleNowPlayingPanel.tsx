import { useEffect, useState } from 'react';
import { usePlaylist } from '@/lib/playlist';
import { Share2, ExternalLink, ArrowBigUp, Music, Plus, ThumbsUp, ThumbsDown, Send } from 'lucide-react';
import Comments from './Comments';
import AppleEmptyState from './AppleEmptyState';
import { pushToast } from '@/lib/toast';
import { redditService, RedditPost } from '@/lib/reddit';
import { youtubeService } from '@/lib/youtube';
import { getStoredAccessToken } from '@/lib/redditAuth';

export default function AppleNowPlayingPanel() {
  const { getCurrentItem, addToPlaylist } = usePlaylist();
  const item = getCurrentItem();
  const [recommendations, setRecommendations] = useState<RedditPost[]>([]);
  const [recLoading, setRecLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [votePending, setVotePending] = useState<null | 'up' | 'down'>(null);
  const [commentPending, setCommentPending] = useState(false);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!item) {
        setRecommendations([]);
        return;
      }
      setRecLoading(true);
      try {
        const res = await redditService.getSubredditPosts(item.subreddit, 'top', 12, undefined, 'week');
        const recs = res.posts
          .filter((post) => post.id !== item.id)
          .filter((post) => youtubeService.extractYouTubeLinks(post).length > 0)
          .slice(0, 6);
        setRecommendations(recs);
      } catch (err) {
        console.error('Error loading recommendations', err);
      } finally {
        setRecLoading(false);
      }
    };
    loadRecommendations();
  }, [item?.id, item?.subreddit]);

  const ensureToken = () => {
    const token = getStoredAccessToken();
    if (!token) {
      pushToast('Connect Reddit first (Login page)', 'info');
      return null;
    }
    return token;
  };

  const vote = async (dir: 1 | -1) => {
    const token = ensureToken();
    if (!token || !item) return;
    setVotePending(dir === 1 ? 'up' : 'down');
    try {
      const thingId = `t3_${item.id}`;
      const res = await fetch('/api/reddit/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: thingId, dir }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Vote failed');
      pushToast(dir === 1 ? 'Upvoted' : 'Downvoted', 'success');
    } catch (err: any) {
      pushToast(err?.message || 'Vote failed', 'error');
    } finally {
      setVotePending(null);
    }
  };

  const submitComment = async () => {
    const token = ensureToken();
    if (!token || !item) return;
    if (!commentText.trim()) return;
    setCommentPending(true);
    try {
      const thingId = `t3_${item.id}`;
      const res = await fetch('/api/reddit/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ thingId, text: commentText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Comment failed');
      pushToast('Comment posted', 'success');
      setCommentText('');
    } catch (err: any) {
      pushToast(err?.message || 'Comment failed', 'error');
    } finally {
      setCommentPending(false);
    }
  };

  const handleShare = async () => {
    if (!item) return;
    try {
      await navigator.clipboard.writeText(`https://reddit.com${item.permalink}`);
      pushToast('Share link copied', 'success');
    } catch {
      pushToast('Unable to copy link', 'error');
    }
  };

  if (!item) {
    return (
      <AppleEmptyState
        icon="🎧"
        title="Nothing playing"
        description="Select a track from the list to see details and comments."
      />
    );
  }

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_20px_60px_-35px_rgba(0,0,0,0.75)] overflow-hidden flex flex-col min-h-[640px]">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-red-600/25 text-red-200 text-xs font-semibold">NOW PLAYING</span>
          <span className="text-sm text-gray-400 truncate">r/{item.subreddit}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-200 hover:text-red-200 hover:border-red-200/40 transition-all duration-200"
            aria-label="Share"
          >
            <Share2 size={16} />
          </button>
          <a
            href={`https://reddit.com${item.permalink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-200 hover:text-red-200 hover:border-red-200/40 transition-all duration-200"
            aria-label="Open on Reddit"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="p-4 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/5 to-white/0 border border-white/10 shadow-inner">
          <img src={item.thumbnail} alt={item.title} className="w-full h-52 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Music size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold line-clamp-2">{item.title}</p>
                <p className="text-xs text-red-200 font-medium">u/{item.author}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-red-200 text-sm">
              <ArrowBigUp size={18} />
              {item.score.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-gray-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Subreddit</span>
            <span className="text-red-200 font-semibold">r/{item.subreddit}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Comments</span>
            <span className="text-gray-200 font-semibold">{item.comments.toLocaleString()}</span>
          </div>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-gray-300 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.18em] text-gray-500">Actions</span>
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => vote(1)}
                disabled={votePending !== null}
                className="px-3 py-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center gap-1"
              >
                <ThumbsUp size={14} />
                Upvote
              </button>
              <button
                onClick={() => vote(-1)}
                disabled={votePending !== null}
                className="px-3 py-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all duration-200 flex items-center gap-1"
              >
                <ThumbsDown size={14} />
                Downvote
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-400">Quick comment</label>
            <div className="flex items-center gap-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Say something nice…"
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400/60"
              />
              <button
                onClick={submitComment}
                disabled={commentPending}
                className="px-3 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200 flex items-center gap-1"
              >
                <Send size={14} />
                Post
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-sm text-gray-300 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.18em] text-gray-500">Recommended</span>
            <span className="text-xs text-gray-500">r/{item.subreddit}</span>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto custom-scroll">
            {recLoading && <div className="text-xs text-gray-500">Loading...</div>}
            {!recLoading && recommendations.length === 0 && (
              <div className="text-xs text-gray-500">No recommendations yet</div>
            )}
            {!recLoading &&
              recommendations.map((rec) => {
                const videoId = youtubeService.extractYouTubeLinks(rec)[0];
                const thumb = youtubeService.getThumbnailUrl(videoId, 'medium');
                return (
                  <div
                    key={rec.id}
                    className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 px-2 py-2 hover:bg-white/10 transition-all duration-200"
                  >
                    <img src={thumb} alt={rec.title} className="w-12 h-12 object-cover rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white line-clamp-1">{rec.title}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">u/{rec.author}</p>
                    </div>
                    <button
                      onClick={() => {
                        addToPlaylist(rec);
                        pushToast('Added to playlist', 'success');
                      }}
                      className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
                      aria-label="Add recommendation to playlist"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 flex-1 min-h-0">
        <div className="p-4 pb-2 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-500">Comments</p>
          <span className="text-xs text-gray-400">Live from Reddit</span>
        </div>
        <div className="h-full overflow-y-auto px-4 pb-4 custom-scroll">
          <Comments />
        </div>
      </div>
    </div>
  );
}


