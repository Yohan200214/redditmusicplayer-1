import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth) return NextResponse.json({ error: 'Missing auth' }, { status: 401 });

    const { thingId, text } = await req.json();
    if (!thingId || !text) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const body = new URLSearchParams({ thing_id: thingId, text });

    const res = await fetch('https://oauth.reddit.com/api/comment', {
      method: 'POST',
      headers: {
        Authorization: auth,
        'User-Agent': 'RedditMusicPlayer/1.0.0',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    });

    const textRes = await res.text();
    if (!res.ok) {
      return NextResponse.json({ error: textRes || res.statusText }, { status: res.status });
    }
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unknown error' }, { status: 500 });
  }
}


