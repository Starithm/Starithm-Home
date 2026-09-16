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
  if (!isBot(req)) {
    console.log(`[event-page fallthrough] path=${pathname} ua="${req.headers.get('user-agent') || ''}"`);
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
