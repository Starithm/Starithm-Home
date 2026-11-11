export const config = { runtime: 'edge' };

import { esc } from './_shared/prerender';
import { CACHE, SITE_BASE, eventTime, eventUrl, listedEvents } from './_shared/events';

/* /novatrace/feed.xml: the newest events as RSS 2.0. Search Console takes a feed as a sitemap and
 * fetches it often, the quickest way for a new event page to be found; researchers can follow it too. */
const ITEMS = 50;
const KIND: Record<string, string> = {
  grb: 'Gamma-ray burst', gw: 'Gravitational-wave event', neutrino: 'Neutrino alert', xray: 'X-ray transient',
  frb: 'Fast radio burst', optical: 'Optical transient',
};

export default async function handler(): Promise<Response> {
  let events;
  try {
    events = await listedEvents();
  } catch {
    return new Response('Feed unavailable', { status: 503, headers: { 'Retry-After': '3600' } });
  }
  const newest = [...events].sort((a, b) => eventTime(b) - eventTime(a)).slice(0, ITEMS);
  const items = newest.map((e) => {
    const name = e.name || e.canonicalId;
    const kind = KIND[String(e.alertKind ?? '').toLowerCase()];
    const when = e.t0 ? new Date(e.t0) : null;
    return `    <item>
      <title>${esc(kind ? `${name}: ${kind}` : name)}</title>
      <link>${esc(eventUrl(e.canonicalId))}</link>
      <guid isPermaLink="true">${esc(eventUrl(e.canonicalId))}</guid>
      ${when ? `<pubDate>${when.toUTCString()}</pubDate>` : ''}
      <description>${esc(`${kind ?? 'Event'} ${name}${when ? `, triggered ${when.toISOString().slice(0, 19).replace('T', ' ')} UTC` : ''}: notices, GCN Circulars and measurements in one record.`)}</description>
    </item>`;
  }).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NovaTrace: new astronomical events</title>
    <link>${SITE_BASE}/novatrace/events</link>
    <atom:link href="${SITE_BASE}/novatrace/feed.xml" rel="self" type="application/rss+xml" />
    <description>Gamma-ray bursts, gravitational waves, neutrino alerts and other transients, each with its GCN notices and Circulars.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': CACHE } });
}
