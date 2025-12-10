import { Metadata } from 'next';
import { redditService } from '@/lib/reddit';
import { youtubeService } from '@/lib/youtube';
import PlayerLayout from '@/components/PlayerLayout';

interface PageProps {
  params: {
    subreddit: string[];
  };
  searchParams: {
    sort?: 'hot' | 'new' | 'top' | 'rising';
  };
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const subredditName = params.subreddit.join('+');
  const sort = searchParams.sort || 'hot';

  try {
    const result = await redditService.getSubredditPosts(subredditName, sort, 5);
    const firstPost = result.posts[0];

    return {
      title: `r/${subredditName} - Reddit Music Player`,
      description: `Browse and play music from r/${subredditName}. ${result.posts.length} posts available.`,
      openGraph: {
        title: `r/${subredditName} - Reddit Music Player`,
        description: `Browse and play music from r/${subredditName}`,
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: `r/${subredditName} - Reddit Music Player`,
      description: `Browse and play music from r/${subredditName}`,
    };
  }
}

export default async function SubredditPage({ params, searchParams }: PageProps) {
  const subredditName = params.subreddit.join('+');
  const sort = searchParams.sort || 'hot';

  let posts = [];
  let error = null;

  try {
    const result = await redditService.getSubredditPosts(subredditName, sort, 25);
    posts = result.posts;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load posts';
    console.error('Error loading subreddit:', err);
  }

  return (
    <PlayerLayout
      initialSubreddit={subredditName}
      initialPosts={posts}
      initialSort={sort}
      error={error}
    />
  );
}

