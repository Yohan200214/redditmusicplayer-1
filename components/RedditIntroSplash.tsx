'use client';

import { useEffect, useState } from 'react';

export default function RedditIntroSplash() {
  const [show, setShow] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storageKey = 'reddit-intro-shown';
    const hasShown = window.localStorage.getItem(storageKey);
    if (hasShown) return;

    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setPrefersReducedMotion(reduceMotion);
    setShow(true);

    const duration = reduceMotion ? 700 : 1700;
    const timer = window.setTimeout(() => {
      setShow(false);
      window.localStorage.setItem(storageKey, 'true');
    }, duration);

    return () => window.clearTimeout(timer);
  }, []);

  if (!show) return null;

  const winkClass = prefersReducedMotion ? '' : 'animate-[introWink_0.25s_ease-in-out_0.8s_forwards]';
  const fadeClass = prefersReducedMotion ? 'animate-[introFade_0.4s_ease-in-out_0.3s_forwards]' : 'animate-[introFade_0.9s_ease-in-out_0.9s_forwards]';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-3xl pointer-events-none">
      <div className={`flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-orange-500 shadow-2xl shadow-red-900/40 ${fadeClass}`}>
        <div className="relative w-16 h-16 rounded-full bg-white flex items-center justify-center">
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500" />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full" />
            <span className={`w-2 h-2 bg-black rounded-full origin-center inline-block ${winkClass}`} />
          </div>
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-5 border-4 border-black border-t-0 rounded-b-full" />
        </div>
      </div>
    </div>
  );
}


