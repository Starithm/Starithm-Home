import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SITE_BASE = 'https://starithm.ai';
const GITHUB_REPO = 'Starithm/starithm-blog-posts';
const GITHUB_BRANCH = 'main';
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const API_BASE = `https://api.github.com/repos/${GITHUB_REPO}/contents/posts`;

function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const meta: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':');
    if (colon === -1) continue;
    meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim().replace(/^"|"$/g, '');
  }
  return meta;
}

const NOVATRACE_API = 'https://novatrace-microservice.onrender.com';

async function main() {
  console.log('Fetching post list from GitHub...');
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const files: Array<{ name: string }> = await res.json();
  const mdFiles = files.filter(f => f.name.endsWith('.md'));

  const posts = await Promise.all(
    mdFiles.map(async (file) => {
      const raw = await fetch(`${RAW_BASE}/posts/${file.name}`).then(r => r.text());
      const meta = parseFrontmatter(raw);
      return {
        slug: meta.slug || file.name.replace('.md', ''),
        date: meta.date || new Date().toISOString().slice(0, 10),
      };
    })
  );

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
