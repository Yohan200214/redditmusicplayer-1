import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth) return NextResponse.json({ error: 'Missing auth' }, { status: 401 });

    const { id, dir } = await req.json();
    if (!id || typeof dir !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const body = new URLSearchParams({ id, dir: String(dir) });

    const res = await fetch('https://oauth.reddit.com/api/vote', {
      method: 'POST',
      headers: {
        Authorization: auth,
        'User-Agent': 'RedditMusicPlayer/1.0.0',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json({ error: text || res.statusText }, { status: res.status });
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}


