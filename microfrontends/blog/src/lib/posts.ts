const GITHUB_REPO = 'Starithm/starithm-blog-posts';
const GITHUB_BRANCH = 'main';
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}`;
const API_BASE = `https://api.github.com/repos/${GITHUB_REPO}/contents/posts`;

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  arxiv_id: string;
  arxiv_url: string;
  authors: string;
  read_time: string;
}

export interface Post extends PostMeta {
  content: string;
}

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

export async function fetchPostList(): Promise<Post[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const files: Array<{ name: string; download_url: string }> = await res.json();

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

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function fetchPost(slug: string): Promise<Post | null> {
  const res = await fetch(`${RAW_BASE}/posts/${slug}.md`);
  if (!res.ok) return null;

  const raw = await res.text();
  const { meta, content } = parseFrontmatter(raw);

  return {
    slug: meta.slug || slug,
    title: meta.title || '',
    date: meta.date || '',
    category: meta.category || 'Astronomy Research',
    excerpt: meta.excerpt || '',
    arxiv_id: meta.arxiv_id || '',
    arxiv_url: meta.arxiv_url || '',
    authors: meta.authors || '',
    read_time: meta.read_time || '5 min read',
    content,
  };
}
