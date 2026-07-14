export const config = { runtime: 'edge' };

const FEED_URL = 'https://raw.githubusercontent.com/Starithm/starithm-blog-posts/main/feed.xml';

export default async function handler(_req: Request): Promise<Response> {
  try {
    const res = await fetch(FEED_URL, { headers: { 'Accept': 'application/xml, text/xml, */*' } });
    if (!res.ok) {
      return new Response('Feed unavailable', { status: 503 });
    }
    const xml = await res.text();
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    });
  } catch {
    return new Response('Feed unavailable', { status: 503 });
  }
}
