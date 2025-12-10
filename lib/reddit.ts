import axios from 'axios';

export interface RedditPost {
  id: string;
  title: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  url: string;
  thumbnail: string;
  subreddit: string;
  selftext?: string;
  is_video?: boolean;
  media?: any;
  domain?: string;
}

export interface RedditResponse {
  data: {
    children: Array<{
      data: RedditPost;
    }>;
    after?: string;
    before?: string;
  };
}

export interface RedditComment {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: number;
  replies?: {
    data: {
      children: Array<{
        data: RedditComment;
        kind: string;
      }>;
    };
  };
}

export class RedditService {
  private baseUrl = 'https://www.reddit.com';

  async getSubredditPosts(
    subreddit: string,
    sort: 'hot' | 'new' | 'top' | 'rising' = 'hot',
    limit: number = 25,
    after?: string,
    time?: 'hour' | 'day' | 'week' | 'month' | 'year' | 'all'
  ): Promise<{ posts: RedditPost[]; after?: string }> {
    try {
      let url = `${this.baseUrl}/r/${subreddit}/${sort}.json?limit=${limit}`;
      if (after) {
        url += `&after=${after}`;
      }
      if (sort === 'top' && time) {
        url += `&t=${time}`;
      }

      const response = await axios.get<RedditResponse>(url, {
        headers: {
          'User-Agent': 'RedditMusicPlayer/1.0.0',
        },
      });

      const posts = response.data.data.children.map((child) => child.data);
      return {
        posts,
        after: response.data.data.after,
      };
    } catch (error) {
      console.error('Error fetching subreddit posts:', error);
      throw error;
    }
  }

  async getMultiSubredditPosts(
    subreddits: string[],
    sort: 'hot' | 'new' | 'top' | 'rising' = 'hot',
    limit: number = 25,
    after?: string
  ): Promise<{ posts: RedditPost[]; after?: string }> {
    const subredditString = subreddits.join('+');
    return this.getSubredditPosts(subredditString, sort, limit, after);
  }

  async getPostComments(permalink: string): Promise<RedditComment[]> {
    try {
      const url = `${this.baseUrl}${permalink}.json`;
      const response = await axios.get<any[]>(url, {
        headers: {
          'User-Agent': 'RedditMusicPlayer/1.0.0',
        },
      });

      // Reddit returns an array: [post data, comments data]
      const commentsData = response.data[1]?.data?.children || [];
      return commentsData
        .filter((item: any) => item.kind === 't1')
        .map((item: any) => item.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  async searchReddit(query: string, limit: number = 25): Promise<RedditPost[]> {
    try {
      const url = `${this.baseUrl}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&type=link`;
      const response = await axios.get<RedditResponse>(url, {
        headers: {
          'User-Agent': 'RedditMusicPlayer/1.0.0',
        },
      });

      return response.data.data.children.map((child) => child.data);
    } catch (error) {
      console.error('Error searching Reddit:', error);
      return [];
    }
  }
}

export const redditService = new RedditService();

