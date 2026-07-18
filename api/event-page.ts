export const config = { runtime: 'edge' };

// Two classes of AI agent, both need the prerendered HTML:
//   - training/index crawlers: gptbot, claudebot, perplexitybot, ...
//   - LIVE user-initiated retrieval (fires when a user asks an assistant about an
//     event): chatgpt-user, oai-searchbot, claude-user/claude-web/claude-searchbot,
//     perplexity-user. Substring matching means the *bot tokens do NOT cover these
//     (e.g. "claudebot" !~ "Claude-User"), so they must be listed explicitly — else a
//     live "tell me about GRB 2607xxx" fetch falls through to the empty React shell.
const BOT_REGEX = /googlebot|google-extended|google-inspectiontool|storebot-google|bingbot|slurp|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|gptbot|chatgpt-user|oai-searchbot|claudebot|claude-user|claude-web|claude-searchbot|anthropic-ai|perplexitybot|perplexity-user|youbot|ccbot|cohere-ai|diffbot|bytespider|applebot|ia_archiver|amazonbot|brightbot|imagesiftbot/i;
const R2_PUBLIC_BASE = 'https://pub-e117ee2751fa4adab6edfadc77df240b.r2.dev/event-html';

async function serveSpa(req: Request): Promise<Response> {
  // Fetch and return the root SPA shell so React mounts normally
  try {
    const spaRes = await fetch(new URL('/index.html', req.url).href);
    if (spaRes.ok) {
      return new Response(await spaRes.text(), {
        headers: { 'content-type': 'text/html; charset=utf-8' },
      });
    }
  } catch {}
  // Fallback: minimal redirect to same URL via meta-refresh
  return new Response(
    `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${req.url}"></head></html>`,
    { headers: { 'content-type': 'text/html; charset=utf-8' } },
  );
}

export default async function handler(req: Request): Promise<Response> {
  const ua = req.headers.get('user-agent') || '';
  const id = new URL(req.url).pathname.split('/events/')[1]?.split('?')[0];

  // Real users — serve the SPA shell so React loads normally
  if (!BOT_REGEX.test(ua)) return serveSpa(req);

  // Bots — serve pre-rendered HTML from R2
  if (!id) return serveSpa(req);

  try {
    const res = await fetch(`${R2_PUBLIC_BASE}/${id}.html`);
    if (!res.ok) return serveSpa(req); // no cached HTML yet → fallback
    return new Response(await res.text(), {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  } catch {
    return serveSpa(req);
  }
}
