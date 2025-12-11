import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import RedditIntroSplash from '@/components/RedditIntroSplash';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reddit Music Player - Stream Music from Reddit',
  description: 'Browse Reddit subreddits, extract YouTube links, and play music with a clean, modern interface. Discover new music from Reddit communities.',
  keywords: ['reddit', 'music', 'player', 'youtube', 'streaming', 'playlist'],
  authors: [{ name: 'Reddit Music Player' }],
  openGraph: {
    title: 'Reddit Music Player',
    description: 'Stream music from Reddit subreddits',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider>
          <RedditIntroSplash />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

