import { getStoredAccessToken } from './redditAuth';

const API_BASE = 'https://oauth.reddit.com';

async function authedFetch(path: string, options: RequestInit = {}) {
  const token = getStoredAccessToken();
  if (!token) throw new Error('Not authenticated with Reddit');
  const headers = {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'RedditMusicPlayer/1.0.0',
    ...options.headers,
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export async function redditVote(thingId: string, dir: 1 | 0 | -1) {
  return authedFetch('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id: thingId, dir: dir.toString() }),
  });
}

export async function redditComment(thingId: string, text: string) {
  return authedFetch('/api/comment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ thing_id: thingId, text }),
  });
}


