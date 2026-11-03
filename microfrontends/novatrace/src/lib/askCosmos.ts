// Ask Evren client: the event stream from POST /api/ask (novatrace_microservice/service/ask.ts).
//
// The answer arrives as server-sent events. EventSource cannot send the Clerk token, so the
// stream is read with fetch() and parsed here. Event types mirror the backend's AskEvent and
// must stay in step with it.
//
// Dev only: `?mock=<name>` replays a stream recorded from the real backend
// (lib/askFixtures/*.json, with its original timing), so the page works without services.

import { API_ENDPOINTS, ASSISTANT_NAME } from '@shared/lib/config';

export type AskStep = 'understanding' | 'searching' | 'found' | 'writing' | 'checking';
export type AskKind = 'event' | 'topic' | 'out_of_scope' | 'degraded' | 'limited' | 'error';

export interface AskSource {
  key: string; n: string; date: string; subject: string; snippet: string;
  event: string | null; eventName: string | null; archive: boolean;
  match: 'vector' | 'event' | 'keyword'; distance: number | null;
  /** Whether the event has a page (only events with notices do; circular-only ones 404). */
  eventPage?: boolean;
  /** Where a digest links instead of the event page: OPTICAL- links to its nearest candidate. */
  url?: string;
}
export interface AskEventFacts {
  canonicalId: string; name: string | null; kind: string | null; aliases: string[] | null; t0: string | null;
  raDeg: number | null; decDeg: number | null; posErrorDeg: number | null; positionQuality: string | null;
  classification: string | null; circularCount: number; noticeCount: number;
  hasSkymap: boolean | null; hasOptical: boolean | null;
  /** Optical candidates near the position (event questions): null = never searched. */
  opticalCandidates?: number | null;
}
export interface AnswerSentence { text: string; cites: string[]; absence: boolean }

export type AskEvent =
  | { type: 'status'; step: AskStep; text: string }
  | { type: 'sources'; sources: AskSource[]; circulars: number; events: number; degraded: boolean }
  | { type: 'context'; mode: 'event'; event: AskEventFacts }
  | { type: 'context'; mode: 'topic'; events: (AskEventFacts & { sources: number })[] }
  | { type: 'text'; block: number; text: string }
  | { type: 'citation'; block: number; key: string; citedText: string }
  | { type: 'done'; searchId: string | null; kind: AskKind; message?: string;
      answer: AnswerSentence[]; dropped: number; check: { sentences: number; circulars: number }; ms: number }
  | { type: 'limited'; reason: 'sign_in' | 'daily' | 'busy'; message: string }
  | { type: 'error'; message: string };

// Dev only: in a production build DEV is false, so the fixtures are tree-shaken out entirely.
const MOCKS: Record<string, () => Promise<unknown>> = import.meta.env.DEV ? import.meta.glob('./askFixtures/*.json') : {};

export const MOCK_NAMES = Object.keys(MOCKS).map((p) => p.replace(/^.*\/(.*)\.json$/, '$1'));

/** Run one question, calling `onEvent` for every event. Resolves when the stream ends. */
export async function streamAsk(
  question: string,
  opts: { token?: string | null; anonId?: string | null; signal: AbortSignal; mock?: string | null },
  onEvent: (e: AskEvent) => void,
): Promise<void> {
  if (opts.mock && import.meta.env.DEV) return replay(opts.mock, opts.signal, onEvent);

  const res = await fetch(API_ENDPOINTS.ask, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
    },
    body: JSON.stringify({ q: question, anonId: opts.anonId ?? undefined }),
    signal: opts.signal,
  });
  if (!res.ok || !res.body) {
    onEvent({ type: 'error', message: `${ASSISTANT_NAME} could not answer right now. Please try again.` });
    return;
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    // Events are separated by a blank line; each carries one `data:` JSON line.
    let cut: number;
    while ((cut = buffer.indexOf('\n\n')) >= 0) {
      const chunk = buffer.slice(0, cut);
      buffer = buffer.slice(cut + 2);
      const data = chunk.split('\n').find((l) => l.startsWith('data: '));
      if (!data) continue;
      try { onEvent(JSON.parse(data.slice(6)) as AskEvent); } catch { /* ignore a malformed event */ }
    }
  }
}

async function replay(name: string, signal: AbortSignal, onEvent: (e: AskEvent) => void): Promise<void> {
  const loader = MOCKS[`./askFixtures/${name}.json`];
  if (!loader) {
    onEvent({ type: 'error', message: `No mock "${name}". Try: ${MOCK_NAMES.join(', ')}` });
    return;
  }
  const fixture = ((await loader()) as { default: { events: { t: number; event: AskEvent }[] } }).default;
  const start = Date.now();
  for (const { t, event } of fixture.events) {
    const wait = t - (Date.now() - start);
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    if (signal.aborted) return;
    onEvent(event);
  }
}

export async function sendFeedback(token: string | null, searchId: string, feedback: 1 | -1, note?: string): Promise<boolean> {
  try {
    const res = await fetch(API_ENDPOINTS.askFeedback, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ searchId, feedback, note }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Anonymous visitors get a random id kept in this browser, so the backend can count their one
// free question. Storage can be blocked (private mode), so every access is guarded.
const ANON_KEY = 'askCosmos.anonId';
const ASKED_KEY = 'askCosmos.anonAsked';

export function anonId(): string | null {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = (crypto.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`);
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

export function anonAskedCount(): number {
  try { return Number(localStorage.getItem(ASKED_KEY) || 0); } catch { return 0; }
}

export function noteAnonAsked(): void {
  try { localStorage.setItem(ASKED_KEY, String(anonAskedCount() + 1)); } catch { /* ignore */ }
}

/** One circular for the source popup: the full alert, or an archive circular's raw text. Cached per key. */
const circularCache = new Map<string, Promise<any | null>>();
export function fetchCircular(key: string): Promise<any | null> {
  if (!circularCache.has(key)) {
    circularCache.set(key, fetch(API_ENDPOINTS.publicCircular(key))
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
      .then((a) => { if (!a) circularCache.delete(key); return a; }));
  }
  return circularCache.get(key)!;
}

/** Lists NovaTrace builds itself, not circulars: an event's notice digest (NOTICES-<id>), its
 *  optical candidates (OPTICAL-<id>), and a time window's events (EVENTS-window). */
const isDigest = (key: string) => /^(NOTICES|OPTICAL|CATALOG|EVENTS)-/.test(key);

/** Whether a source opens in the popup. Circulars do; digests link to pages instead. */
export const opensInPopup = (key: string) => !isDigest(key);

/** Where a circular lives: extracted ones open their event page, the rest open on GCN / ATel. */
export function circularUrl(s: Pick<AskSource, 'key' | 'n' | 'url'>): string {
  // Optical candidates link to the nearest candidate's Lasair/TNS page: the event page doesn't list them.
  if (s.key.startsWith('OPTICAL-') && s.url) return s.url;
  // An event's notice digest and optical candidates (NOTICES-/OPTICAL-<canonical_id>) link to its event page.
  const eventDigest = s.key.match(/^(?:NOTICES|OPTICAL|CATALOG)-(.+)$/);
  if (eventDigest) return `/novatrace/events/${encodeURIComponent(eventDigest[1])}`;
  if (s.key.startsWith('EVENTS-')) return '/novatrace/events';
  if (s.key.startsWith('ATel-')) return `https://www.astronomerstelegram.org/?read=${s.key.slice(5)}`;
  return `https://gcn.nasa.gov/circulars/${s.key.replace(/^GCN-/, '')}`;
}

/** The link text for a digest source: where circularUrl sends it. */
export function digestLinkLabel(s: Pick<AskSource, 'key' | 'url'>): string {
  if (s.key.startsWith('EVENTS-')) return 'All events →';
  if (s.key.startsWith('OPTICAL-') && s.url) return 'Nearest candidate →';
  return 'Event page →';
}

/** Off-site links (Lasair, TNS) open in a new tab, so the answer isn't lost. */
export const linkTarget = (href: string) =>
  /^https?:/.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};

/** A display name for an event. `primary_name` can be null in canonical_events (seen live on
 * GRB 261024A), so fall back to a capitalised alias, then the canonical id. Never throws. */
export function eventLabel(e: Pick<AskEventFacts, 'name' | 'aliases' | 'canonicalId'>, short = false): string {
  const name = e.name || (e.aliases ?? []).find((a) => /[A-Z]/.test(a)) || e.canonicalId;
  return short ? name.replace(/^LIGO\/Virgo\/KAGRA /, '') : name;
}

/** Short label for a source: "GCN 41436", "ATel 18121", "Notices" / "Optical" for the digests. */
export function sourceLabel(s: Pick<AskSource, 'key' | 'n'>): string {
  if (s.key.startsWith('NOTICES-')) return 'Notices';
  if (s.key.startsWith('OPTICAL-')) return 'Optical';
  if (s.key.startsWith('CATALOG-')) return 'Catalogs';
  if (s.key.startsWith('EVENTS-')) return 'Events';
  if (s.key.startsWith('ATel-')) return `ATel ${s.key.slice(5)}`;
  return `GCN ${s.n}`;
}

export const EXAMPLE_QUESTIONS = [
  { q: 'GRB 250108A', kind: 'Event' },
  { q: 'Kilonova candidates with a red near-infrared excess', kind: 'Topic' },
  { q: 'What did Keck observe for S250818k?', kind: 'Event' },
  { q: 'Which GRBs had near-infrared afterglow candidates in 2025?', kind: 'Topic' },
];
