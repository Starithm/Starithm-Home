export const config = { runtime: 'edge' };

import { isBot, htmlResponse, serveSpa, esc, injectHead } from './_shared/prerender';

// The homepage for crawlers. index.html is the shell every SPA route shares, so its tags are generic and
// its body is empty: Googlebot and AI fetchers saw only "Starithm - Real-time Astronomical Event
// Intelligence Platform". Mirrors api/melody-page.ts: bots get the page's text and real tags; humans get
// the SPA shell untouched. The content mirrors microfrontends/home/components/Homepage.tsx; keep the two in
// step (the accuracy figures come from the blog article how-accurate-is-starithm-extraction).

const SITE = 'https://starithm.ai';
const API = (process.env.VITE_API_BASE_URL || 'https://novatrace-microservice.onrender.com').replace(/\/$/, '');

const TITLE = 'Starithm: astronomy’s memory layer';
const DESCRIPTION =
  'Starithm keeps the whole record of each astronomical transient: GCN notices and circulars for gamma-ray bursts, gravitational-wave, neutrino and X-ray events, read, linked and kept as one event page where every value links to its source. Ask Evren answers questions from about 45,000 GCN Circulars.';

const FEATURES: [string, string][] = [
  ['Ask Evren', 'Ask in plain English. Answers come from about 45,000 GCN Circulars since 1997, recent ATels and GCN notices, each sentence linked to the circular it came from.'],
  ['Event pages', 'One page per event: notices timeline, circulars, best position, key facts, every reported observation, a sky map of the error region and a citation.'],
  ['Values as data', 'Magnitudes, upper limits, fluxes, fluences, T90 and redshifts read out of the circular text, each quoting the sentence it came from.'],
  ['Counterparts', 'Related events matched by time and position with a false-alarm check, optical candidates from Lasair, TNS and Fink, known catalogue sources in the error region, and X-ray light curves.'],
  ['Live', 'Fermi, Swift, Einstein Probe, SVOM, LIGO/Virgo/KAGRA, IceCube, CHIME, MAXI and more, in one schema, updated as notices and circulars arrive.'],
];

interface Latest { alertKey: string; label: string; event: string | null; canonicalId: string | null; date: string; what: string }

/** The newest circulars, if the API answers within 2 s; the page is complete without them. */
async function latest(): Promise<Latest[]> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 2000);
    const r = await fetch(`${API}/api/public/latest`, { signal: ctrl.signal });
    clearTimeout(t);
    if (!r.ok) return [];
    const x = await r.json();
    return Array.isArray(x) ? x.filter((k: Latest) => k?.alertKey && Number.isFinite(Date.parse(k.date))).slice(0, 8) : [];
  } catch {
    return [];
  }
}

function tags(): string {
  const image = `${SITE}/og/starithm-share.png`;
  return [
    `<title>${esc(TITLE)}</title>`,
    `<meta name="description" content="${esc(DESCRIPTION)}" />`,
    `<link rel="canonical" href="${SITE}/" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${SITE}/" />`,
    `<meta property="og:title" content="${esc(TITLE)}" />`,
    `<meta property="og:description" content="${esc(DESCRIPTION)}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(TITLE)}" />`,
    `<meta name="twitter:description" content="${esc(DESCRIPTION)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<script type="application/ld+json">${JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        { '@type': 'Organization', '@id': `${SITE}/#organization`, name: 'Starithm', url: SITE,
          logo: { '@type': 'ImageObject', url: `${SITE}/logo_without_name.png` },
          sameAs: ['https://github.com/Starithm', 'https://www.linkedin.com/company/starithm'] },
        { '@type': 'WebSite', '@id': `${SITE}/#website`, url: SITE, name: 'Starithm', description: DESCRIPTION,
          publisher: { '@id': `${SITE}/#organization` },
          potentialAction: { '@type': 'SearchAction', target: `${SITE}/novatrace/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
      ],
    })}</script>`,
  ].join('\n  ');
}

function body(items: Latest[]): string {
  const li = (s: string) => `<li>${s}</li>`;
  return `<div id="__prerender__" style="max-width:800px;margin:0 auto;padding:2rem;font-family:sans-serif;color:#111;line-height:1.7">
  <p>An operating system for observational astronomy</p>
  <h1>Astronomy’s memory layer.</h1>
  <p>A transient is announced in seconds and understood over months. Starithm holds the whole arc, machine notice → final measurement, as one structured record you can open, cite and follow.</p>
  <p><a href="${SITE}/novatrace/search">Ask Evren a question</a> · <a href="${SITE}/novatrace/events">Open NovaTrace</a></p>
  <section><h2>The problem</h2><ul>
    ${li('GCN delivers, then forgets. The notice is broadcast. Nothing links it to what came after.')}
    ${li('Brokers filter, then forget. Volume is reduced. History is not retained.')}
    ${li('Observatories publish later. The measurement lands in circular text, unlinked and unstructured.')}
  </ul><p>Starithm keeps the record. One page per event. Every value linked to the circular it came from.</p></section>
  <section><h2>One page per event. A source on every value.</h2><ul>
    ${FEATURES.map(([t, d]) => li(`<strong>${esc(t)}.</strong> ${esc(d)}`)).join('\n    ')}
  </ul></section>
  <section><h2>Measured, not claimed</h2><ul>
    ${li('Redshift: for 327 of 346 gamma-ray bursts (94.5%) at least one extracted value agrees with GRBweb to within Δz = 0.01.')}
    ${li('T90: Swift-BAT values agree with the Swift GRB table within 10% for 92.2% of bursts.')}
    ${li('Fluence (15–150 keV): Swift-BAT values agree with the Swift GRB table within 10% for 94.5% of bursts.')}
    ${li('The single redshift shown on an event page agrees for 86.0%; telling a burst’s redshift from a host galaxy’s or a limit is work in progress.')}
  </ul><p><a href="${SITE}/blog/posts/how-accurate-is-starithm-extraction">How we measured</a></p></section>
  <section><h2>From alert to event page</h2><ol>
    ${li('Collect: GCN notices (Fermi, Swift, Einstein Probe, SVOM, LIGO/Virgo/KAGRA, IceCube, CHIME, MAXI), GCN Circulars since 1997 and ATels, as they are issued.')}
    ${li('Read: the values in each circular (magnitudes, limits, fluxes, durations, redshifts, positions), each with the sentence it came from. Example: z = 3.51 ± 0.10 for GRB 260924A from GCN 45740.')}
    ${li('One event: every notice and circular about the same event linked into one record, by trigger number, name and position (GRB 260924A: Fermi trigger 811905208 and Swift trigger 1513082).')}
    ${li('Counterparts: afterglows and candidates near the position (Lasair, TNS, Fink) and known sources in the region from HEASARC catalogues (4FGL, TeVCat, XMM, 2SXPS, 2RXS).')}
    ${li('Catalogues: refined values from the Fermi GBM burst catalogue and the Swift GRB table, and Swift-XRT light curves from the UK Swift Science Data Centre.')}
    ${li('Publish: one page per event, cited and searchable; new notices, circulars and corrections go through again and the page updates.')}
  </ol></section>
  ${items.length ? `<section><h2>Latest circulars</h2><ul>
    ${items.map(k => li(`<a href="${k.canonicalId ? `${SITE}/novatrace/events/${encodeURIComponent(k.canonicalId)}` : `${SITE}/novatrace/events`}">${esc(k.label)}</a>${k.event ? ` (${esc(k.event)})` : ''}: ${esc(k.what)}, ${esc(new Date(k.date).toISOString().slice(0, 16).replace('T', ' '))} UTC`)).join('\n    ')}
  </ul></section>` : ''}
  <section><h2>Built for astronomers</h2><p>Values are extracted by language models, and each links to its circular. If you spot an error, have observations or data to add, or want to help shape what we build: <a href="mailto:contact.starithm@gmail.com">contact.starithm@gmail.com</a> or <a href="https://www.linkedin.com/company/starithm">LinkedIn</a>. Reading needs no account.</p></section>
</div>
<script>document.getElementById('__prerender__').style.display='none';</script>`;
}

export default async function handler(req: Request): Promise<Response> {
  if (!isBot(req)) return serveSpa(req, 'spa');
  let template: string;
  try {
    const spaRes = await fetch(new URL('/index.html', req.url).href);
    if (!spaRes.ok) return serveSpa(req, 'error');
    template = await spaRes.text();
  } catch {
    return serveSpa(req, 'error');
  }
  return htmlResponse(injectHead(template, tags(), body(await latest())), 'hit');
}
