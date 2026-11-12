import { isBot } from './api/_shared/prerender';

// Vercel routing middleware: runs before static files. "/" is the static index.html, which Vercel serves
// before applying vercel.json rewrites, so a rewrite to api/home-page never ran (checked on the preview,
// 2026-11-12). Crawlers are sent to the prerendered homepage here; everyone else continues to index.html.
// `x-starithm-as-bot: 1` shows the crawler version from a browser (for checking deployments behind
// Vercel's login); it reveals nothing beyond what crawlers already get.
export const config = { matcher: '/' };

export default async function middleware(req: Request): Promise<Response | undefined> {
  const asBot = req.headers.get('x-starithm-as-bot') === '1';
  if (!asBot && !isBot(req)) return undefined;
  const headers = new Headers(req.headers);
  if (asBot) headers.set('user-agent', 'Mozilla/5.0 (compatible; Googlebot/2.1; starithm-check)');
  try {
    return await fetch(new URL('/api/home-page', req.url), { headers });
  } catch {
    return undefined; // fall through to the static shell
  }
}
