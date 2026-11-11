export const config = { runtime: 'edge' };

import { esc } from './_shared/prerender';
import { CACHE, SITE_BASE, eventTime, eventUrl, listedEvents, type ListedEvent } from './_shared/events';

/* The sitemap index and its live event sitemaps. Until 2026-11-11 one static sitemap was written at
 * build time, so an event that arrived after a deploy waited for the next one, and it listed only the
 * 657 events with an AI summary. Now:
 *   /sitemap.xml                   index (the URL Search Console and robots.txt know)
 *   /sitemaps/pages.xml            blog and other pages, static, written at build (generate-sitemap.ts)
 *   /sitemaps/events-recent.xml    events from the last RECENT_DAYS days: small, changes hourly
 *   /sitemaps/events.xml           every other listed event
 * Split so Search Console reports indexing per part, and the small changing file is re-read more often.
 * "Recent" is by the event's own time, not its last update: backfills touch thousands of old events. */
const RECENT_DAYS = 14;

const xml = (body: string) => new Response(`<?xml version="1.0" encoding="UTF-8"?>\n${body}\n`, {
  headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': CACHE },
});

const urlset = (events: ListedEvent[]) => xml(`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${events.map((e) => `  <url><loc>${esc(eventUrl(e.canonicalId))}</loc>${e.updatedAt ? `<lastmod>${new Date(e.updatedAt).toISOString()}</lastmod>` : ''}</url>`).join('\n')}
</urlset>`);

export default async function handler(req: Request): Promise<Response> {
  const part = new URL(req.url).searchParams.get('part') ?? 'index';
  let events: ListedEvent[];
  try {
    events = await listedEvents();
  } catch {
    // Without the list, the index still points at the pages sitemap; event parts ask to retry.
    if (part !== 'index') return new Response('Event list unavailable', { status: 503, headers: { 'Retry-After': '3600' } });
    events = [];
  }
  const cutoff = Date.now() - RECENT_DAYS * 86_400_000;
  const recent = events.filter((e) => eventTime(e) >= cutoff);
  const older = events.filter((e) => eventTime(e) < cutoff);

  if (part === 'recent') return urlset(recent);
  if (part === 'events') return urlset(older);

  const lastmod = (list: ListedEvent[]) => {
    const t = Math.max(0, ...list.map((e) => Date.parse(e.updatedAt ?? '') || 0));
    return t ? `<lastmod>${new Date(t).toISOString()}</lastmod>` : '';
  };
  return xml(`<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap><loc>${SITE_BASE}/sitemaps/pages.xml</loc></sitemap>
  <sitemap><loc>${SITE_BASE}/sitemaps/events-recent.xml</loc>${lastmod(recent)}</sitemap>
  <sitemap><loc>${SITE_BASE}/sitemaps/events.xml</loc>${lastmod(older)}</sitemap>
</sitemapindex>`);
}
