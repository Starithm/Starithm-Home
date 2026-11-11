/* The pages sitemap (/sitemaps/pages.xml): blog and other static pages, written at build. Event pages are
 * in the live sitemaps served by api/sitemap.ts, which /sitemap.xml indexes; they used to be listed here,
 * so an event arriving after a deploy waited for the next one. */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_BASE = 'https://starithm.ai';
const INDEX_URL = 'https://raw.githubusercontent.com/Starithm/starithm-blog-posts/main/posts/index.json';

async function main() {
  console.log('Fetching post index from GitHub...');
  const res = await fetch(INDEX_URL);
  if (!res.ok) throw new Error(`Failed to fetch index.json: ${res.status}`);
  const entries: Array<Record<string, string>> = await res.json();

  const posts = entries.map(e => ({
    slug: e.slug,
    date: e.date || new Date().toISOString().slice(0, 10),
  }));

  const staticRoutes = [
    { url: `${SITE_BASE}/blog`, priority: '1.0', changefreq: 'daily' },
    { url: `${SITE_BASE}/blog/roadmap`, priority: '0.8', changefreq: 'weekly' },
  ];

  const postRoutes = posts.map(p => ({
    url: `${SITE_BASE}/blog/posts/${p.slug}`,
    lastmod: p.date,
    priority: '0.8',
    changefreq: 'monthly',
  }));

  const allRoutes = [...staticRoutes, ...postRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${r.url}</loc>
    ${r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : ''}
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, 'sitemap-pages.xml'), xml);
  console.log(`✅ sitemap-pages.xml generated with ${allRoutes.length} URLs`);
}

main().catch(e => { console.error(e); process.exit(1); });
