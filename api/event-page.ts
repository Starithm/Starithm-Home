export const config = { runtime: 'edge' };

import { isBot, htmlResponse, serveSpa } from './_shared/prerender';

const R2_PUBLIC_BASE = 'https://pub-e117ee2751fa4adab6edfadc77df240b.r2.dev/event-html';

export default async function handler(req: Request): Promise<Response> {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/events/')[1]?.split('?')[0];

  // Real users — serve the SPA shell so React loads normally.
  // DIAGNOSTIC: log every non-bot fallthrough. A real browser here is expected noise,
  // but if an AI agent's UA is NOT in BOT_REGEX it surfaces here — grep Vercel Function
  // Logs for "[event-page fallthrough]" to capture the exact UA string to add, then
  // remove this log once the bot list is settled. (Web Request API, not next/server.)
  // Since 2026-11-17 it also says who the visitor is: Vercel's geo headers (city is URL-encoded), the client
  // IP, where they came from, and the browser's own hints. Missing headers are logged as "-".
  if (!isBot(req)) {
    const h = (name: string) => req.headers.get(name) || '-';
    let city = h('x-vercel-ip-city');
    try { city = decodeURIComponent(city); } catch { /* malformed encoding: log it raw rather than fail the page */ }
    const ip = h('x-real-ip') !== '-' ? h('x-real-ip') : h('x-forwarded-for').split(',')[0].trim();
    console.log(
      `[event-page fallthrough] path=${pathname} ip=${ip} ` +
        `geo="${city}, ${h('x-vercel-ip-country-region')}, ${h('x-vercel-ip-country')}" ` +
        `latlon=${h('x-vercel-ip-latitude')},${h('x-vercel-ip-longitude')} tz=${h('x-vercel-ip-timezone')} ` +
        `ref="${h('referer')}" lang="${h('accept-language')}" ` +
        `platform=${h('sec-ch-ua-platform')} mobile=${h('sec-ch-ua-mobile')} fetch=${h('sec-fetch-site')}/${h('sec-fetch-mode')} ` +
        `ua="${h('user-agent')}"`,
    );
    return serveSpa(req, 'spa');
  }

  // Bots — serve pre-rendered HTML from R2
  if (!id) return serveSpa(req, 'no-id');

  try {
    const res = await fetch(`${R2_PUBLIC_BASE}/${id}.html`);
    if (!res.ok) return serveSpa(req, 'miss'); // no cached HTML yet → fallback
    return htmlResponse(await res.text(), 'hit');
  } catch {
    return serveSpa(req, 'error');
  }
}
