# Reddit Music Player

A modern, SSR-powered Reddit music player that extracts YouTube links from Reddit posts and creates a seamless music streaming experience.

## Features

- 🎵 **Browse Subreddits** - Explore music from any Reddit subreddit
- 🔍 **Fast Search** - Search Reddit or browse by subreddit
- 📺 **YouTube Integration** - Automatically extracts and plays YouTube videos
- 📋 **Playlist Management** - Build and manage your music queue
- 💬 **Comments & Metadata** - View Reddit comments and post details
- 🎨 **Modern UI** - Clean, responsive interface with dark mode support
- ⚡ **SSR Powered** - Server-side rendering for better SEO
- 🚀 **Fast & Smooth** - Optimized for performance

## Tech Stack

- **Next.js 14** - React framework with SSR
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **Zustand** - State management
- **React YouTube** - YouTube player integration
- **Axios** - HTTP client
- **Date-fns** - Date formatting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd redditmusicplayer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Browse Subreddits**: Navigate to `/r/[subreddit]` (e.g., `/r/listentothis`)
2. **Search**: Use the search bar to find posts across Reddit
3. **Add to Playlist**: Click "Add to Playlist" on any post with a YouTube link
4. **Play**: Videos automatically play in sequence
5. **View Comments**: Click on the Comments tab to see Reddit discussions

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page (redirects)
│   └── r/                 # Subreddit routes (SSR)
├── components/            # React components
│   ├── VideoPlayer.tsx   # YouTube player
│   ├── Playlist.tsx      # Playlist management
│   ├── SubredditBrowser.tsx # Subreddit browser
│   ├── Comments.tsx      # Comments display
│   └── PlayerLayout.tsx  # Main layout
├── lib/                   # Utilities and services
│   ├── reddit.ts         # Reddit API service
│   ├── youtube.ts        # YouTube utilities
│   └── playlist.ts       # Playlist state management
└── public/                # Static assets
```

## Building for Production

```bash
npm run build
npm start
```

## Features in Detail

### Subreddit Browsing
- Browse any Reddit subreddit
- Sort by Hot, New, Top, or Rising
- Filter posts to show only those with YouTube links
- Add individual posts or all posts at once

### Playlist Management
- Add/remove videos
- Shuffle playlist
- Navigate between videos
- Clear entire playlist

### Video Player
- Full YouTube player controls
- Volume control
- Play/pause
- Skip forward/backward
- Auto-play next video

### Comments
- View Reddit comments for current video
- Nested comment threads
- Link to original Reddit post

## SEO Features

- Server-side rendering for all subreddit pages
- Dynamic metadata generation
- Proper URL structure
- Open Graph tags

## License

GPLv3

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
