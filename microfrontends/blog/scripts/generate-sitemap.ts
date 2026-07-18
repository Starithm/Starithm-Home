import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_BASE = 'https://starithm.ai';
const INDEX_URL = 'https://raw.githubusercontent.com/Starithm/starithm-blog-posts/main/posts/index.json';

const NOVATRACE_API = 'https://novatrace-microservice.onrender.com';

async function main() {
  console.log('Fetching post index from GitHub...');
  const res = await fetch(INDEX_URL);
  if (!res.ok) throw new Error(`Failed to fetch index.json: ${res.status}`);
  const entries: Array<Record<string, string>> = await res.json();

  const posts = entries.map(e => ({
    slug: e.slug,
    date: e.date || new Date().toISOString().slice(0, 10),
  }));

  console.log('Fetching event list from Novatrace API...');
  let events: Array<{ canonicalId: string; updatedAt: string }> = [];
  try {
    const evRes = await fetch(`${NOVATRACE_API}/api/public/events`);
    if (evRes.ok) events = await evRes.json();
    console.log(`  Found ${events.length} events`);
  } catch (e) {
    console.warn('  Could not fetch events (non-fatal):', e);
  }

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

  const eventRoutes = events.map(e => ({
    url: `${SITE_BASE}/novatrace/events/${e.canonicalId}`,
    lastmod: e.updatedAt ? new Date(e.updatedAt).toISOString().slice(0, 10) : undefined,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  const allRoutes = [...staticRoutes, ...eventRoutes, ...postRoutes];

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
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
  console.log(`✅ sitemap.xml generated with ${allRoutes.length} URLs`);
}

main().catch(e => { console.error(e); process.exit(1); });
