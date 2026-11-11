/* The event pages search engines should index, from NovaTrace (GET /api/public/events: events with at
 * least one circular, not from Earth or the Sun; novatrace_microservice/service/indexable.ts). Shared by
 * the sitemap and the events feed. Render can take a while to wake, so callers cache their output at the
 * CDN and serve the stale copy while it refreshes. */
export const NOVATRACE_API = 'https://novatrace-microservice.onrender.com';
export const SITE_BASE = 'https://starithm.ai';

export interface ListedEvent { canonicalId: string; name?: string; alertKind?: string; t0?: string | null; updatedAt?: string }

export async function listedEvents(): Promise<ListedEvent[]> {
  const res = await fetch(`${NOVATRACE_API}/api/public/events`, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`events list ${res.status}`);
  return res.json();
}

export const eventUrl = (id: string) => `${SITE_BASE}/novatrace/events/${encodeURIComponent(id)}`;

/** When the event began: what "recent" and the feed sort by. An event with no trigger time is an old
 *  one known only from circulars (most pre-2025 GRBs: 2,448 of 2,810 on 2026-11-11), so it counts as old.
 *  Falling back to the last update put them all in the recent sitemap after a backfill touched them. */
export const eventTime = (e: ListedEvent) => (e.t0 ? Date.parse(e.t0) || 0 : 0);

/** The CDN keeps a copy for an hour and serves it for a day while refreshing. */
export const CACHE = 'public, max-age=600, s-maxage=3600, stale-while-revalidate=86400';
