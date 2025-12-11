'use client';

import { useState, useEffect } from 'react';
import { usePlaylist } from '@/lib/playlist';
import { redditService } from '@/lib/reddit';
import { RedditComment } from '@/lib/reddit';
import { Loader2, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Comments() {
  const { getCurrentItem } = usePlaylist();
  const currentItem = getCurrentItem();
  const [comments, setComments] = useState<RedditComment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentItem) {
      loadComments(currentItem.permalink);
    } else {
      setComments([]);
    }
  }, [currentItem]);

  const loadComments = async (permalink: string) => {
    setLoading(true);
    try {
      const loadedComments = await redditService.getPostComments(permalink);
      setComments(loadedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSkeletons = () => (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="animate-pulse">
          <div className="h-3 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
          <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-1" />
          <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
      ))}
    </div>
  );

  if (!currentItem) {
    return (
      <div className="p-6 text-center text-gray-500">
        <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
        <p>Select a video to view comments</p>
      </div>
    );
  }

  const renderComment = (comment: RedditComment, depth: number = 0, index: number = 0) => {
    if (depth > 3) return null; // Limit nesting depth

    return (
      <div
        key={comment.id}
        className={`mb-3 animate-fadeIn transition-all duration-200 ${depth > 0 ? 'ml-6 border-l-2 border-red-200 dark:border-red-900/30 pl-4' : 'reddit-card p-3'}`}
        style={{ animationDelay: `${(depth * 0.1 + index * 0.05)}s` }}
      >
        <div className="mb-2">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-2">
            <span className="font-semibold text-red-500 dark:text-red-400 hover:underline cursor-pointer">
              u/{comment.author}
            </span>
            <span className="text-gray-400">•</span>
            <span>{formatDistanceToNow(new Date(comment.created_utc * 1000), { addSuffix: true })}</span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1">
              <span className="text-red-500">▲</span>
              {comment.score.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{comment.body}</p>
        </div>
        {comment.replies?.data?.children && comment.replies.data.children.length > 0 && (
          <div className="mt-3">
            {comment.replies.data.children
              .filter((child: any) => child.kind === 't1')
              .map((child: any, idx: number) => renderComment(child.data, depth + 1, idx))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-red-200 dark:border-red-900/30 bg-white dark:bg-gray-900">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
          <MessageSquare size={20} />
          Comments ({comments.length})
        </h2>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          <a
            href={`https://reddit.com${currentItem.permalink}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:underline"
          >
            View on Reddit →
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          renderSkeletons()
        ) : comments.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No comments available</p>
          </div>
        ) : (
          <div className="space-y-2">{comments.map((comment, index) => renderComment(comment, 0, index))}</div>
        )}
      </div>
    </div>
  );
}

