export interface YouTubeVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  duration?: string;
}

export class YouTubeService {
  /**
   * Extract YouTube video ID from various URL formats
   */
  extractVideoId(url: string): string | null {
    if (!url) return null;

    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Check if URL is a YouTube URL
   */
  isYouTubeUrl(url: string): boolean {
    return /youtube\.com|youtu\.be/.test(url);
  }

  /**
   * Extract YouTube links from Reddit post
   */
  extractYouTubeLinks(post: { url: string; selftext?: string }): string[] {
    const links: string[] = [];
    const text = `${post.url} ${post.selftext || ''}`;

    // Match YouTube URLs
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/g;
    const matches = text.matchAll(youtubeRegex);

    for (const match of matches) {
      if (match[1] && !links.includes(match[1])) {
        links.push(match[1]);
      }
    }

    return links;
  }

  /**
   * Get YouTube embed URL
   */
  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`;
  }

  /**
   * Get YouTube thumbnail URL
   */
  getThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'standard' | 'maxres' = 'high'): string {
    const qualityMap = {
      default: 'default',
      medium: 'mqdefault',
      high: 'hqdefault',
      standard: 'sddefault',
      maxres: 'maxresdefault',
    };

    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
  }

  /**
   * Filter Reddit posts to only include those with YouTube links
   */
  filterPostsWithYouTube(posts: any[]): any[] {
    return posts.filter((post) => {
      const links = this.extractYouTubeLinks(post);
      return links.length > 0;
    });
  }
}

export const youtubeService = new YouTubeService();

