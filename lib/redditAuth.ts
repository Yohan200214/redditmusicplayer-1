const AUTH_BASE = 'https://www.reddit.com/api/v1/authorize';
const SCOPES = ['identity', 'vote', 'submit', 'read'].join(' ');

interface BuildAuthUrlOptions {
  state?: string;
  duration?: 'temporary' | 'permanent';
  redirectUri?: string;
}

export function getRedditClientId() {
  if (typeof process === 'undefined') return '';
  return process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID || '';
}

export function buildAuthUrl(opts: BuildAuthUrlOptions = {}) {
  const clientId = getRedditClientId();
  if (!clientId) return '';
  const state = opts.state || 'rmp-state';
  const duration = opts.duration || 'temporary';
  const redirectUri = opts.redirectUri || (typeof window !== 'undefined' ? window.location.origin + '/login' : '');
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'token', // implicit flow
    state,
    redirect_uri: redirectUri,
    duration,
    scope: SCOPES,
  });
  return `${AUTH_BASE}?${params.toString()}`;
}

export function storeAccessToken(token: string, expiresIn: number) {
  if (typeof window === 'undefined') return;
  const expiresAt = Date.now() + expiresIn * 1000;
  window.localStorage.setItem('reddit_access_token', token);
  window.localStorage.setItem('reddit_access_token_expires', expiresAt.toString());
}

export function getStoredAccessToken() {
  if (typeof window === 'undefined') return null;
  const token = window.localStorage.getItem('reddit_access_token');
  const expires = window.localStorage.getItem('reddit_access_token_expires');
  if (!token || !expires) return null;
  if (Date.now() > parseInt(expires, 10)) {
    window.localStorage.removeItem('reddit_access_token');
    window.localStorage.removeItem('reddit_access_token_expires');
    return null;
  }
  return token;
}


