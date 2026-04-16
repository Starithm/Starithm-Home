export const config = { runtime: 'edge' };

const BOT_REGEX = /googlebot|google-extended|google-inspectiontool|storebot-google|bingbot|slurp|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|gptbot|claudebot|anthropic-ai|perplexitybot|youbot|ccbot|cohere-ai|diffbot|bytespider|applebot|ia_archiver|amazonbot|brightbot|imagesiftbot/i;
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
