// Shared by every prerendering edge function under api/. Vercel ignores directories
// whose name starts with "_", so this is a module, not a route.

// Three classes of agent, all of which need the prerendered HTML:
//   - training/index crawlers: gptbot, claudebot, perplexitybot, ...
//   - LIVE user-initiated retrieval (fires when a user asks an assistant about an
//     event): chatgpt-user, oai-searchbot, claude-user/claude-web/claude-searchbot,
//     perplexity-user. Substring matching means the *bot tokens do NOT cover these
//     (e.g. "claudebot" !~ "Claude-User"), so they must be listed explicitly — else a
//     live "tell me about GRB 2607xxx" fetch falls through to the empty React shell.
//   - LINK UNFURLERS, which fetch once when a human pastes a URL into a chat app and
//     render the og:/twitter: tags as a preview card. These were missing until
//     2026-09-16: Slack, Discord, Bluesky and Reddit all received the empty React
//     shell, so a shared event link showed the generic site-wide card. Verified with
//     `curl -A "Slackbot-LinkExpanding 1.0" -I` → x-starithm-prerender: spa.
export const BOT_REGEX =
  /googlebot|googleother|google-extended|google-inspectiontool|storebot-google|bingbot|slurp|duckduckbot|baiduspider|yandex|facebookexternalhit|facebookcatalog|twitterbot|linkedinbot|whatsapp|telegrambot|slackbot|slack-imgproxy|discordbot|redditbot|cardyb|bsky|mastodon|pleroma|misskey|pinterest|tumblr|flipboard|embedly|iframely|skypeuripreview|vkshare|nuzzel|snapchat|viber|line-podcast|opengraph|metainspector|gptbot|chatgpt-user|oai-searchbot|claudebot|claude-user|claude-web|claude-searchbot|anthropic-ai|perplexitybot|perplexity-user|youbot|ccbot|cohere-ai|diffbot|bytespider|applebot|ia_archiver|amazonbot|brightbot|imagesiftbot/i;

// Diagnostic header so `curl -I` reveals what the edge function did, without fetching
// the body. Values:
//   hit          — bot, served prerendered HTML
//   miss         — bot, but nothing prerendered for this URL → SPA fallback
//   error        — bot, upstream fetch threw → SPA fallback
//   no-id        — bot, could not parse an id from the path → SPA fallback
//   spa          — normal user, served the SPA shell (expected)
export const PRERENDER_HEADER = 'x-starithm-prerender';

export function isBot(req: Request): boolean {
  return BOT_REGEX.test(req.headers.get('user-agent') || '');
}

// Vary: User-Agent is required because these routes serve DIFFERENT bodies per UA;
// without it, any caching layer could serve one UA's body to another.
export function htmlResponse(body: string, prerenderState: string): Response {
  return new Response(body, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'vary': 'User-Agent',
      [PRERENDER_HEADER]: prerenderState,
    },
  });
}

/** Fetch and return the root SPA shell so React mounts normally. */
export async function serveSpa(req: Request, state: string): Promise<Response> {
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

export const esc = (v: unknown) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * The shell index.html carries the site-wide og:/twitter: tags for the homepage.
 * Leaving them in place while injecting per-page ones produces DUPLICATE properties,
 * and unfurlers disagree on whether first or last wins — so strip before injecting.
 */
// Also covers the plain name="description"/"title"/"author" tags: leaving the shell's
// site-wide description in place left TWO description tags on every prerendered page.
export const SOCIAL_META_RE =
  /[ \t]*<meta\s+(?:property|name)="(?:og:[^"]*|twitter:[^"]*|article:[^"]*|description|title|author)"[^>]*>\s*\n?/gi;

export function injectHead(template: string, tags: string, bodyPrefix = ''): string {
  let html = template
    .replace(SOCIAL_META_RE, '')
    .replace(/[ \t]*<title>[^<]*<\/title>\s*\n?/i, '')
    .replace(/[ \t]*<link\s+rel="canonical"[^>]*>\s*\n?/i, '')
    .replace(/(<head[^>]*>)/i, `$1\n  ${tags}`);
  if (bodyPrefix) html = html.replace(/(<body[^>]*>)/i, `$1\n${bodyPrefix}`);
  return html;
}

/** Cut to `max` chars on a word boundary so a card never ends mid-word. */
export function truncate(text: string, max = 200): string {
  const s = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return s;
  const cut = s.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '') + '…';
}
