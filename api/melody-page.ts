export const config = { runtime: 'edge' };

import { isBot, htmlResponse, serveSpa, esc, injectHead, truncate } from './_shared/prerender';

// Ears to the Universe tracks are published DAILY by the sky-melodies pipeline, so the
// card cannot be baked at build time — a deploy from yesterday would describe the wrong
// melody. This resolves the track at request time from the same R2 JSON the player reads.
//
//   /ears-to-the-universe                  latest day, first track
//   /ears-to-the-universe/:date            that day, first track
//   /ears-to-the-universe/:date/:trackId   a specific track (the shareable link)
//
// Mirrors api/event-page.ts: bots get the prerendered card, humans get the SPA shell
// untouched so they never pay for the R2 round trip.
const MELODIES_BASE = (
  process.env.MELODIES_BASE_URL ||
  process.env.VITE_MELODIES_BASE_URL ||
  'https://pub-98ea3f3b6e584f4ba217ccf6bcc4bc1f.r2.dev'
).replace(/\/$/, '');

const SITE_BASE = 'https://starithm.ai';
const BASE_PATH = '/ears-to-the-universe';

// Interpolated into an R2 URL, so both are constrained rather than trusted.
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TRACK_ID_RE = /^[A-Za-z0-9._-]+$/;

interface Chapter { start_s: number; end_s: number; heading: string; text: string }
interface Track {
  id: string;
  release_date: string;
  duration_s: number;
  title: string;
  logline: string | null;
  chapters: Chapter[];
  science_note: string | null;
  target: { name: string; classification: string | null; type?: string | null; match?: string };
  observation: { program_id: string; program_title: string; instrument: string; observed: string | null };
  arrangement?: { name: string; instruments: string[]; reason: string | null } | null;
}

async function getJson<T>(key: string): Promise<T | null> {
  try {
    const res = await fetch(`${MELODIES_BASE}/${key}`);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** "Seyfert 2 Galaxy" from SIMBAD when matched by name, else the tail of MAST's classification. */
function targetKind(track: Track): string | null {
  if (track.target.type && track.target.match === 'name') return track.target.type;
  const parts = (track.target.classification || '').split(';').map(s => s.trim()).filter(Boolean);
  return parts.length ? parts[parts.length - 1] : track.target.type ?? null;
}

function assetUrl(track: Track, file: string): string {
  return `${MELODIES_BASE}/tracks/${track.release_date}/${track.id}/${file}`;
}

function buildTags(track: Track): string {
  const url = `${SITE_BASE}${BASE_PATH}/${track.release_date}/${track.id}`;
  const kind = targetKind(track);
  // The target is what makes one melody distinguishable from another in a list of
  // shared links, so it rides in the title rather than only in the description.
  const title = `${track.title} · ${track.target.name}`;
  // The target name is already in the title, so the description carries what the title
  // cannot: the poem, what kind of object it is, and where the sound came from.
  const description = truncate(
    [track.logline || track.science_note, kind ? `${kind}.` : null, 'Made audible from JWST observations.']
      .filter(Boolean)
      .join(' '),
    200,
  );
  // story.png is 700x700. A square image under summary_large_image gets centre-cropped
  // to 1.91:1 by most unfurlers, losing the top and bottom of the artwork, so this
  // deliberately requests the square `summary` card instead.
  const image = assetUrl(track, 'story.png');

  return [
    `<title>${esc(title)} · Ears to the Universe · Starithm</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="music.song" />`,
    `<meta property="og:site_name" content="Starithm" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="700" />`,
    `<meta property="og:image:height" content="700" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:alt" content="${esc(`Artwork for ${track.title}, made from JWST observations of ${track.target.name}`)}" />`,
    `<meta property="og:audio" content="${esc(assetUrl(track, 'musical.m4a'))}" />`,
    `<meta property="og:audio:type" content="audio/mp4" />`,
    `<meta property="music:duration" content="${Math.round(track.duration_s)}" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(image)}" />`,
    `<meta name="twitter:image:alt" content="${esc(`Artwork for ${track.title}`)}" />`,
    `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'MusicRecording',
      name: track.title,
      url,
      duration: `PT${Math.round(track.duration_s)}S`,
      datePublished: track.release_date,
      description: track.logline || undefined,
      image,
      audio: { '@type': 'AudioObject', contentUrl: assetUrl(track, 'musical.m4a'), encodingFormat: 'audio/mp4' },
      about: { '@type': 'Thing', name: track.target.name, description: targetKind(track) || undefined },
      isBasedOn: {
        '@type': 'Dataset',
        name: `JWST ${track.observation.instrument} observation of ${track.target.name}`,
        identifier: track.observation.program_id,
      },
      publisher: { '@type': 'Organization', name: 'Starithm', '@id': `${SITE_BASE}/#organization` },
    })}</script>`,
  ].join('\n  ');
}

/** Readable content for AI crawlers, which do not run the player. Hidden from humans. */
function buildPrerenderBody(track: Track): string {
  const kind = targetKind(track);
  const chapters = (track.chapters || [])
    .map(c => `<section><h2>${esc(c.heading)}</h2><p>${esc(c.text).replace(/\n/g, '<br />')}</p></section>`)
    .join('\n  ');

  return `<div id="__prerender__" style="max-width:800px;margin:0 auto;padding:2rem;font-family:sans-serif;color:#111;line-height:1.7">
  <nav style="margin-bottom:1.5rem"><a href="${BASE_PATH}">← Ears to the Universe</a></nav>
  <p style="color:#666;font-size:.9rem">${esc(track.release_date)} · ${esc(track.observation.instrument)} · PROGRAM ${esc(track.observation.program_id)}</p>
  <h1 style="font-size:2rem;margin:.5rem 0">${esc(track.title)}</h1>
  <p style="color:#555"><em>${esc(track.target.name)}${kind ? ` — ${esc(kind)}` : ''}</em></p>
  ${track.logline ? `<p style="font-size:1.1rem">${esc(track.logline)}</p>` : ''}
  ${track.arrangement ? `<p>Arranged for ${esc(track.arrangement.instruments.join(', '))} (${esc(track.arrangement.name)}).${track.arrangement.reason ? ` ${esc(track.arrangement.reason)}` : ''}</p>` : ''}
  ${chapters}
  ${track.science_note ? `<section><h2>The science</h2><p>${esc(track.science_note)}</p></section>` : ''}
  <p>Program: ${esc(track.observation.program_title)}</p>
  <p><a href="${SITE_BASE}${BASE_PATH}/${esc(track.release_date)}/${esc(track.id)}">Listen on Starithm →</a></p>
</div>
<script>document.getElementById('__prerender__').style.display='none';</script>`;
}

export default async function handler(req: Request): Promise<Response> {
  const { pathname } = new URL(req.url);

  if (!isBot(req)) return serveSpa(req, 'spa');

  // ["2026-09-13", "jw07802-..."] — either or both may be absent.
  const segments = pathname.slice(BASE_PATH.length).split('/').filter(Boolean);
  const [dateParam, trackParam] = segments;

  if (dateParam && !DATE_RE.test(dateParam)) return serveSpa(req, 'no-id');
  if (trackParam && !TRACK_ID_RE.test(trackParam)) return serveSpa(req, 'no-id');

  let date = dateParam;
  if (!date) {
    const index = await getJson<{ latest_date: string | null }>('index.json');
    if (!index?.latest_date) return serveSpa(req, 'miss');
    date = index.latest_date;
  }

  const day = await getJson<{ tracks: Track[] }>(`days/${date}.json`);
  const tracks = day?.tracks ?? [];
  if (!tracks.length) return serveSpa(req, 'miss');

  const track = (trackParam && tracks.find(t => t.id === trackParam)) || tracks[0];

  let template: string;
  try {
    const spaRes = await fetch(new URL('/index.html', req.url).href);
    if (!spaRes.ok) return serveSpa(req, 'error');
    template = await spaRes.text();
  } catch {
    return serveSpa(req, 'error');
  }

  return htmlResponse(injectHead(template, buildTags(track), buildPrerenderBody(track)), 'hit');
}
