export const config = { runtime: 'edge' };

const BOT_REGEX = /googlebot|bingbot|slurp|duckduckbot|baiduspider|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot/i;
const R2_PUBLIC_BASE = 'https://pub-e117ee2751fa4adab6edfadc77df240b.r2.dev/event-html';

export default async function handler(req: Request): Promise<Response | undefined> {
  const ua = req.headers.get('user-agent') || '';
  if (!BOT_REGEX.test(ua)) return undefined; // real users → passthrough to SPA

  const id = new URL(req.url).pathname.split('/events/')[1]?.split('?')[0];
  if (!id) return undefined;

  try {
    const res = await fetch(`${R2_PUBLIC_BASE}/${id}.html`);
    if (!res.ok) return undefined; // no cached HTML → fallback to SPA
    return new Response(await res.text(), {
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  } catch {
    return undefined; // on any error → fallback to SPA
  }
}
