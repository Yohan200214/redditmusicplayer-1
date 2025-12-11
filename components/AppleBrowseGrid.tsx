import SubredditBrowser from './SubredditBrowser';
import type { RedditPost } from '@/lib/reddit';

interface AppleBrowseGridProps {
  initialSubreddit?: string;
  initialPosts?: RedditPost[];
  subredditOverride?: string;
}

export default function AppleBrowseGrid({ initialSubreddit, initialPosts, subredditOverride }: AppleBrowseGridProps) {
  return (
    <div className="rounded-3xl bg-white/70 dark:bg-black/40 backdrop-blur-xl border border-white/50 dark:border-white/10 shadow-[0_25px_70px_-45px_rgba(0,0,0,0.8)] overflow-hidden animate-fadeIn">
      <SubredditBrowser
        initialSubreddit={initialSubreddit}
        initialPosts={initialPosts}
        subredditOverride={subredditOverride}
        onSubredditChange={() => {}}
      />
    </div>
  );
}


