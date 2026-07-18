export const config = { runtime: 'edge' };

// Two classes of AI agent, both need the prerendered HTML:
//   - training/index crawlers: gptbot, claudebot, perplexitybot, ...
//   - LIVE user-initiated retrieval (fires when a user asks an assistant about an
//     event): chatgpt-user, oai-searchbot, claude-user/claude-web/claude-searchbot,
//     perplexity-user. Substring matching means the *bot tokens do NOT cover these
//     (e.g. "claudebot" !~ "Claude-User"), so they must be listed explicitly — else a
//     live "tell me about GRB 2607xxx" fetch falls through to the empty React shell.
const BOT_REGEX = /googlebot|googleother|google-extended|google-inspectiontool|storebot-google|bingbot|slurp|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|gptbot|chatgpt-user|oai-searchbot|claudebot|claude-user|claude-web|claude-searchbot|anthropic-ai|perplexitybot|perplexity-user|youbot|ccbot|cohere-ai|diffbot|bytespider|applebot|ia_archiver|amazonbot|brightbot|imagesiftbot/i;
const R2_PUBLIC_BASE = 'https://pub-e117ee2751fa4adab6edfadc77df240b.r2.dev/event-html';

// Diagnostic header so `curl -I` reveals what the edge function did, without fetching
// the body. Values:
//   hit          — bot, served prerendered HTML from R2
//   miss         — bot, but no prerendered HTML for this event → SPA fallback
//   error        — bot, R2 fetch threw → SPA fallback
//   no-id        — bot, could not parse an event id → SPA fallback
//   spa          — normal user, served the SPA shell (expected)
// Vary: User-Agent is required because this route serves DIFFERENT bodies per UA;
// without it, any future caching layer could serve one UA's body to another.
const PRERENDER_HEADER = 'x-starithm-prerender';

function htmlResponse(body: string, prerenderState: string): Response {
  return new Response(body, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'vary': 'User-Agent',
      [PRERENDER_HEADER]: prerenderState,
    },
  });
}

async function serveSpa(req: Request, state: string): Promise<Response> {
  // Fetch and return the root SPA shell so React mounts normally
  try {
    const spaRes = await fetch(new URL('/index.html', req.url).href);
    if (spaRes.ok) return htmlResponse(await spaRes.text(), state);
  } catch {}
  // Fallback: minimal redirect to same URL via meta-refresh
  return htmlResponse(
    `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${req.url}"></head></html>`,
    state,
  );
}

export default async function handler(req: Request): Promise<Response> {
  const ua = req.headers.get('user-agent') || '';
  const { pathname } = new URL(req.url);
  const id = pathname.split('/events/')[1]?.split('?')[0];
  const isBot = BOT_REGEX.test(ua);

  // Real users — serve the SPA shell so React loads normally.
  // DIAGNOSTIC: log every non-bot fallthrough. A real browser here is expected noise,
  // but if an AI agent's UA is NOT in BOT_REGEX it surfaces here — grep Vercel Function
  // Logs for "[event-page fallthrough]" to capture the exact UA string to add, then
  // remove this log once the bot list is settled. (Web Request API, not next/server.)
  if (!isBot) {
    console.log(`[event-page fallthrough] path=${pathname} ua="${ua}"`);
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
