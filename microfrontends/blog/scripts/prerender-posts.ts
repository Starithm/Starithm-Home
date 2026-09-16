// Pre-renders a static HTML page for each blog post into dist/posts/{slug}/index.html.
// Run AFTER vite build. Uses the built index.html as the shell so React mounts normally
// for real users. Bots see SEO meta tags + full content in <noscript>.
// copy-microfrontends copies dist/* → dist/blog/, so these land at dist/blog/posts/{slug}/index.html.
// Vercel serves static files before checking rewrites, so bots get pre-rendered HTML.

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
// Same helpers the edge prerenderers use — the strip-then-inject rule in particular must
// not drift between the two, or one surface regrows the duplicate-og:tag bug.
import { esc, injectHead, truncate } from '../../../api/_shared/prerender';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GITHUB_REPO = 'Starithm/starithm-blog-posts';
const GITHUB_BRANCH = 'main';
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}`;
// Post list comes from the CDN index.json, NOT api.github.com.
// api.github.com is 60 req/hr per IP when unauthenticated, and Vercel build machines share
// hot IPs — that budget is routinely already spent by other builds, which failed this script
// with `GitHub API error: 403` and took the whole deploy down (2026-09-11).
// raw.githubusercontent.com is CDN-backed and not rate limited; generate-sitemap.ts has
// always used it, which is exactly why that step succeeded in the same failing build.
const INDEX_URL = `${RAW_BASE}/posts/index.json`;
const SITE_BASE = 'https://starithm.ai';
const DEFAULT_OG_IMAGE = `${SITE_BASE}/og/starithm-share.png`;

interface PostMeta {
  slug: string; title: string; date: string; category: string;
  excerpt: string; arxiv_id: string; arxiv_url: string; authors: string; read_time: string;
  /** Optional per-post share card; falls back to the site-wide card. Frontmatter: `image`. */
  image: string;
}
interface Post extends PostMeta { content: string; }

function parseFrontmatter(raw: string): { meta: Partial<PostMeta>; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: raw };
  const meta: Partial<PostMeta> = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const value = line.slice(colon + 1).trim().replace(/^"|"$/g, '');
    (meta as any)[key] = value;
  }
  return { meta, content: match[2].trim() };
}

function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const out: string[] = [];
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) { out.push(`<p>${para.join(' ')}</p>`); para = []; }
  };

  const inlineFormat = (s: string) =>
    s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
     .replace(/\*(.+?)\*/g, '<em>$1</em>')
     .replace(/`([^`]+)`/g, '<code>$1</code>')
     .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  for (const line of lines) {
    const h3 = line.match(/^### (.+)/);
    const h2 = line.match(/^## (.+)/);
    const h1 = line.match(/^# (.+)/);
    const bq = line.match(/^> (.+)/);

    if (h1 || h2 || h3 || bq) {
      flushPara();
      if (h1) out.push(`<h1>${inlineFormat(h1[1])}</h1>`);
      else if (h2) out.push(`<h2>${inlineFormat(h2[1])}</h2>`);
      else if (h3) out.push(`<h3>${inlineFormat(h3[1])}</h3>`);
      else if (bq) out.push(`<blockquote>${inlineFormat(bq[1])}</blockquote>`);
    } else if (line.trim() === '') {
      flushPara();
    } else {
      para.push(inlineFormat(line.trim()));
    }
  }
  flushPara();
  return out.join('\n');
}

/** The tags every page needs, in one place, so no surface ships a partial set.
 *  Twitter reads twitter:* in preference to og:*, so omitting them (as this script did
 *  until 2026-09-16) makes every post share as the generic site card on X. */
function socialTags(o: {
  /** Browser tab / search result title. */
  title: string;
  /** Card headline; defaults to `title`. Kept separate because unfurlers render
   *  og:site_name themselves, so "… | Starithm Blog" in the card wastes width. */
  cardTitle?: string;
  description: string; url: string; type: 'article' | 'website';
  image: string; imageAlt: string; author?: string; publishedTime?: string; section?: string;
}): string {
  const cardTitle = o.cardTitle ?? o.title;
  // Dimensions are only asserted for the site card, whose size we know. Claiming
  // 1200x630 for a per-post image of some other shape makes unfurlers reserve the
  // wrong box and render a stretched or letterboxed card.
  const isDefaultImage = o.image === DEFAULT_OG_IMAGE;

  return [
    `<title>${esc(o.title)}</title>`,
    `<meta name="description" content="${esc(o.description)}" />`,
    `<link rel="canonical" href="${o.url}" />`,
    `<meta property="og:type" content="${o.type}" />`,
    `<meta property="og:site_name" content="Starithm" />`,
    `<meta property="og:title" content="${esc(cardTitle)}" />`,
    `<meta property="og:description" content="${esc(o.description)}" />`,
    `<meta property="og:url" content="${o.url}" />`,
    `<meta property="og:image" content="${esc(o.image)}" />`,
    ...(isDefaultImage
      ? [
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          `<meta property="og:image:type" content="image/png" />`,
        ]
      : []),
    `<meta property="og:image:alt" content="${esc(o.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(cardTitle)}" />`,
    `<meta name="twitter:description" content="${esc(o.description)}" />`,
    `<meta name="twitter:image" content="${esc(o.image)}" />`,
    `<meta name="twitter:image:alt" content="${esc(o.imageAlt)}" />`,
    ...(o.author ? [`<meta name="author" content="${esc(o.author)}" />`] : []),
    ...(o.publishedTime ? [`<meta property="article:published_time" content="${esc(o.publishedTime)}" />`] : []),
    ...(o.author ? [`<meta property="article:author" content="${esc(o.author)}" />`] : []),
    ...(o.section ? [`<meta property="article:section" content="${esc(o.section)}" />`] : []),
  ].join('\n  ');
}

function buildHtml(post: Post, template: string): string {
  const url = `${SITE_BASE}/blog/posts/${post.slug}`;
  // Cards are cut on a word boundary — a hard 160-char slice ended posts mid-word
  // ("...with a sh"). 200 is within what Facebook, Slack and X display.
  const description = truncate(post.excerpt, 200);

  const metaTags = socialTags({
    title: `${post.title} | Starithm Blog`,
    cardTitle: post.title,
    description,
    url,
    type: 'article',
    image: post.image || DEFAULT_OG_IMAGE,
    imageAlt: post.image ? post.title : "Starithm: Astronomy's memory layer",
    author: post.authors,
    publishedTime: post.date,
    section: post.category,
  });

  const contentHtml = markdownToHtml(post.content);

  const noscript = `<div id="__prerender__" style="max-width:800px;margin:0 auto;padding:2rem;font-family:sans-serif;color:#111;line-height:1.7">
  <nav style="margin-bottom:1.5rem"><a href="/blog" style="color:#6b21a8">← Starithm Blog</a></nav>
  <p style="color:#666;font-size:.9rem">${esc(post.category)} · ${esc(post.date)} · ${esc(post.read_time)}</p>
  <h1 style="font-size:2rem;margin:.5rem 0">${esc(post.title)}</h1>
  <p style="color:#555"><em>${esc(post.authors)}</em></p>
  ${post.excerpt ? `<p style="font-size:1.1rem;color:#333;border-left:4px solid #6b21a8;padding-left:1rem;margin:1.5rem 0">${esc(post.excerpt)}</p>` : ''}
  <article>${contentHtml}</article>
  ${post.arxiv_url ? `<p>arXiv: <a href="${post.arxiv_url}" style="color:#6b21a8">${esc(post.arxiv_id)}</a></p>` : ''}
  <hr style="margin:2rem 0" />
  <p><a href="${url}" style="color:#6b21a8">View on Starithm →</a></p>
</div>
<script>document.getElementById('__prerender__').style.display='none';</script>`;

  return injectHead(template, metaTags, noscript);
}

function buildTemplate(distDir: string): string {
  // Use the root shell index.html (built before blog in build:all).
  // It loads React + all MFE bundles and handles routing — correct entry point for all pages.
  const rootIndexPath = path.resolve(distDir, '../../../dist/index.html');
  if (fs.existsSync(rootIndexPath)) {
    return fs.readFileSync(rootIndexPath, 'utf-8');
  }
  // Fallback for local dev: minimal shell pointing to root assets
  throw new Error(`Root dist/index.html not found at ${rootIndexPath}. Run root vite build first.`);
}

async function main() {
  const distDir = path.resolve(__dirname, '../dist');
  const template = buildTemplate(distDir);

  console.log('Fetching post list from CDN index.json...');
  const res = await fetch(INDEX_URL);
  if (!res.ok) throw new Error(`post index fetch failed: ${res.status} ${INDEX_URL}`);
  const index: any = await res.json();
  const entries: Array<{ slug: string }> = Array.isArray(index) ? index : (index?.posts ?? []);
  if (!entries.length) throw new Error(`post index is empty at ${INDEX_URL}`);
  // Every entry's markdown lives at posts/<slug>.md (verified 100/100, 2026-09-11).
  const mdFiles = entries.map(e => ({ name: `${e.slug}.md` }));

  const posts = await Promise.all(
    mdFiles.map(async (file) => {
      const raw = await fetch(`${RAW_BASE}/posts/${file.name}`).then(r => r.text());
      const { meta, content } = parseFrontmatter(raw);
      return {
        slug: meta.slug || file.name.replace('.md', ''),
        title: meta.title || file.name,
        date: meta.date || '',
        category: meta.category || 'Astronomy Research',
        excerpt: meta.excerpt || '',
        arxiv_id: meta.arxiv_id || '',
        arxiv_url: meta.arxiv_url || '',
        authors: meta.authors || '',
        read_time: meta.read_time || '5 min read',
        image: meta.image || '',
        content,
      } as Post;
    })
  );

  // Pre-render individual post pages
  for (const post of posts) {
    const outDir = path.join(distDir, 'posts', post.slug);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'index.html'), buildHtml(post, template));
    console.log(`  ✓ ${post.slug}`);
  }

  // Pre-render the blog list page (/blog) so Googlebot can discover all post links
  const listNoscript = `<div id="__prerender__" style="max-width:900px;margin:0 auto;padding:2rem;font-family:sans-serif;color:#111;line-height:1.7">
  <h1 style="font-size:2rem;margin-bottom:.5rem">Starithm Blog</h1>
  <p style="color:#666;margin-bottom:2rem">Astronomy research, multi-messenger astrophysics, and engineering from the Starithm team.</p>
  <ul style="list-style:none;padding:0">
    ${posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(p => `<li style="margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid #eee">
      <a href="/blog/posts/${p.slug}" style="color:#6b21a8;font-size:1.2rem;font-weight:600;text-decoration:none">${p.title}</a>
      <p style="color:#666;font-size:.85rem;margin:.25rem 0">${p.category} · ${p.date} · ${p.read_time}</p>
      ${p.excerpt ? `<p style="color:#444;margin:.5rem 0">${p.excerpt}</p>` : ''}
    </li>`).join('\n    ')}
  </ul>
</div>
<script>document.getElementById('__prerender__').style.display='none';</script>`;

  const listMetaTags = socialTags({
    title: 'Starithm Blog | Astronomy Research & Engineering',
    cardTitle: 'Starithm Blog',
    description: 'Astronomy research summaries, multi-messenger astrophysics insights, and engineering updates from the Starithm team.',
    url: `${SITE_BASE}/blog`,
    type: 'website',
    image: DEFAULT_OG_IMAGE,
    imageAlt: "Starithm: Astronomy's memory layer",
  });

  const listHtml = injectHead(template, listMetaTags, listNoscript);

  fs.writeFileSync(path.join(distDir, 'index.html'), listHtml);
  console.log(`  ✓ blog list page (index.html)`);

  console.log(`✅ Pre-rendered ${posts.length} blog posts + list page to dist/`);
}

main().catch(e => { console.error(e); process.exit(1); });
