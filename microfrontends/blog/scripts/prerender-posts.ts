// Pre-renders a static HTML page for each blog post into dist/posts/{slug}/index.html.
// Run AFTER vite build. Uses the built index.html as the shell so React mounts normally
// for real users. Bots see SEO meta tags + full content in <noscript>.
// copy-microfrontends copies dist/* → dist/blog/, so these land at dist/blog/posts/{slug}/index.html.
// Vercel serves static files before checking rewrites, so bots get pre-rendered HTML.

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GITHUB_REPO = 'Starithm/starithm-blog-posts';
const GITHUB_BRANCH = 'main';
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const API_BASE = `https://api.github.com/repos/${GITHUB_REPO}/contents/posts`;
const SITE_BASE = 'https://starithm.ai';

interface PostMeta {
  slug: string; title: string; date: string; category: string;
  excerpt: string; arxiv_id: string; arxiv_url: string; authors: string; read_time: string;
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

function buildHtml(post: Post, template: string): string {
  const url = `${SITE_BASE}/blog/posts/${post.slug}`;
  const esc = (s: string) => s.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const description = esc(post.excerpt.slice(0, 160));
  const title = esc(post.title);

  const metaTags = [
    `<title>${post.title} | Starithm Blog</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta name="author" content="${esc(post.authors)}" />`,
    `<link rel="canonical" href="${url}" />`,
  ].join('\n  ');

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

  return template
    .replace(/<title>[^<]*<\/title>/, '')           // remove existing title
    .replace(/(<head[^>]*>)/, `$1\n  ${metaTags}`)  // inject our SEO tags (includes title)
    .replace(/(<body[^>]*>)/, `$1\n${noscript}`);
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

  console.log('Fetching post list from GitHub...');
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const files: Array<{ name: string }> = await res.json();
  const mdFiles = files.filter(f => f.name.endsWith('.md'));

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

  const listMetaTags = [
    `<title>Starithm Blog | Astronomy Research & Engineering</title>`,
    `<meta name="description" content="Astronomy research summaries, multi-messenger astrophysics insights, and engineering updates from the Starithm team." />`,
    `<meta property="og:title" content="Starithm Blog" />`,
    `<meta property="og:description" content="Astronomy research summaries and engineering updates from Starithm." />`,
    `<meta property="og:url" content="${SITE_BASE}/blog" />`,
    `<link rel="canonical" href="${SITE_BASE}/blog" />`,
  ].join('\n  ');

  const listHtml = template
    .replace(/<title>[^<]*<\/title>/, '')
    .replace(/(<head[^>]*>)/, `$1\n  ${listMetaTags}`)
    .replace(/(<body[^>]*>)/, `$1\n${listNoscript}`);

  fs.writeFileSync(path.join(distDir, 'index.html'), listHtml);
  console.log(`  ✓ blog list page (index.html)`);

  console.log(`✅ Pre-rendered ${posts.length} blog posts + list page to dist/`);
}

main().catch(e => { console.error(e); process.exit(1); });
