# Quick Start Guide

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Visit http://localhost:3000

## Key Features

### 1. Browse Subreddits
- Navigate to `/r/[subreddit]` (e.g., `/r/listentothis`)
- Posts are automatically filtered to show only YouTube videos
- Sort by Hot, New, Top, or Rising

### 2. Search
- Use the search bar to search across Reddit
- Results are filtered to show YouTube videos only

### 3. Playlist Management
- Click "Add to Playlist" on any post
- Or click "Add All YouTube Videos" to add all at once
- Manage your queue in the Playlist view

### 4. Video Player
- Videos play automatically
- Use controls to play/pause, skip, adjust volume
- Auto-advances to next video when current ends

### 5. Comments
- View Reddit comments for the current video
- Click "View on Reddit" to see full discussion

## Architecture

- **SSR Pages**: `/app/r/[...subreddit]/page.tsx` - Server-side rendered subreddit pages for SEO
- **State Management**: Zustand store in `/lib/playlist.ts`
- **Reddit API**: Service in `/lib/reddit.ts`
- **YouTube**: Utilities in `/lib/youtube.ts`
- **Components**: Reusable React components in `/components/`

## Environment

No environment variables needed - uses public Reddit API.

## Production Build

```bash
npm run build
npm start
```

## Notes

- All Reddit API calls use the public JSON API (no authentication required)
- YouTube videos are embedded using react-youtube
- Playlist state persists during session (clears on refresh)
- Dark mode supported via Tailwind CSS

