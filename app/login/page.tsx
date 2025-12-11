'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildAuthUrl, getRedditClientId, getStoredAccessToken, storeAccessToken } from '@/lib/redditAuth';
import { ShieldCheck, AlertTriangle, CheckCircle2, Link2, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const clientId = getRedditClientId();

  // Parse implicit grant token from hash when redirected back
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', ''));
      const accessToken = params.get('access_token');
      const expiresIn = params.get('expires_in');
      if (accessToken && expiresIn) {
        storeAccessToken(accessToken, parseInt(expiresIn, 10));
        window.location.hash = '';
        setToken(accessToken);
        setStatus('connected');
      }
    } else {
      const stored = getStoredAccessToken();
      if (stored) {
        setToken(stored);
        setStatus('connected');
      }
    }
  }, []);

  const authorizeUrl = useMemo(() => buildAuthUrl(), [clientId]);

  const canAuth = Boolean(clientId) && Boolean(authorizeUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-[#0a0c12] dark:via-[#0f131b] dark:to-[#151b26] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl rounded-3xl bg-white/90 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-2xl shadow-[0_30px_90px_-45px_rgba(0,0,0,0.55)] p-8 space-y-8">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white flex items-center justify-center shadow-lg shadow-red-500/25">
            <Link2 size={22} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">Connect</p>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">Link your Reddit account</h1>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-gray-800 dark:text-white">
              <ShieldCheck className="text-red-500" size={18} />
              <span className="text-sm font-semibold">What you get</span>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Upvote / downvote directly from the player</li>
              <li>• Comment on tracks without leaving the app</li>
              <li>• Uses Reddit’s official OAuth flow</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 p-4 space-y-3">
            <div className="flex items-center gap-2 text-gray-800 dark:text-white">
              <AlertTriangle className="text-amber-500" size={18} />
              <span className="text-sm font-semibold">Notes</span>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• We never store your password.</li>
              <li>• You can revoke access anytime in Reddit settings.</li>
              <li>• Requires env `NEXT_PUBLIC_REDDIT_CLIENT_ID`.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 dark:bg-white/5 border border-white/50 dark:border-white/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">Connection status</p>
              <div className="flex items-center gap-2 text-gray-800 dark:text-white">
                {status === 'connected' ? (
                  <>
                    <CheckCircle2 size={18} className="text-green-500" />
                    <span className="text-sm font-semibold">Connected to Reddit</span>
                  </>
                ) : (
                  <>
                    <LogIn size={18} className="text-red-500" />
                    <span className="text-sm font-semibold">Not connected</span>
                  </>
                )}
              </div>
            </div>
            <a
              href={canAuth ? authorizeUrl : undefined}
              className={`px-5 py-3 rounded-full text-white text-sm font-semibold shadow-lg transition-all duration-200 ${
                canAuth
                  ? 'bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:shadow-xl hover:-translate-y-0.5'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {status === 'connected' ? 'Re-authenticate' : 'Connect Reddit'}
            </a>
          </div>
          {!canAuth && (
            <p className="text-xs text-red-500">
              Set NEXT_PUBLIC_REDDIT_CLIENT_ID in your environment to enable Reddit login.
            </p>
          )}
          {token && (
            <p className="text-xs text-gray-500 break-all">
              Access token stored locally (hidden here). Ready for vote/comment actions.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


