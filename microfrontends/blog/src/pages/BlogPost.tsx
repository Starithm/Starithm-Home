import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, Calendar, Clock, User, ExternalLink } from 'lucide-react';
import { fetchPost, fetchPostList, Post, PostMeta } from '../lib/posts';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [post, setPost] = useState<Post | null>((location.state as any)?.post ?? null);
  const [loading, setLoading] = useState(!(location.state as any)?.post);
  const [error, setError] = useState(false);
  const [prevPost, setPrevPost] = useState<PostMeta | null>(null);
  const [nextPost, setNextPost] = useState<PostMeta | null>(null);

  const applyPostMeta = (p: Post) => {
    const url = `https://starithm.ai/blog/posts/${p.slug}`;
    const title = `${p.title} — Starithm Blog`;
    const description = p.excerpt || `${p.category} research from Starithm.`;

    document.title = title;

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); document.head.appendChild(el); }
      el.setAttribute(attr, val);
    };
    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el); }
      el.href = href;
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:type"]', 'content', 'article');
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="twitter:url"]', 'content', url);
    setMeta('meta[property="twitter:title"]', 'content', title);
    setMeta('meta[property="twitter:description"]', 'content', description);
    setLink('canonical', url);

    // JSON-LD BlogPosting
    const existing = document.getElementById('ld-blogpost');
    if (existing) existing.remove();
    const ld = document.createElement('script');
    ld.id = 'ld-blogpost';
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.excerpt,
      url,
      datePublished: p.date,
      author: p.authors ? { '@type': 'Person', name: p.authors } : { '@type': 'Organization', name: 'Starithm' },
      publisher: { '@type': 'Organization', name: 'Starithm', url: 'https://starithm.ai' },
      ...(p.arxiv_url ? { sameAs: p.arxiv_url, citation: { '@type': 'CreativeWork', url: p.arxiv_url } } : {}),
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      keywords: `astronomy, ${p.category}, astrophysics, GCN, transients`,
    });
    document.head.appendChild(ld);
  };

  useEffect(() => {
    const statePost = (location.state as any)?.post as Post | undefined;
    if (statePost) {
      setPost(statePost);
      applyPostMeta(statePost);
    } else {
      if (!slug) return;
      setLoading(true);
      fetchPost(slug)
        .then(p => {
          setPost(p);
          if (p) applyPostMeta(p);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }

    return () => {
      // Restore defaults on unmount
      document.title = 'Starithm — Astronomical Event Intelligence';
      document.getElementById('ld-blogpost')?.remove();
      const canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (canon) canon.href = 'https://starithm.ai/';
    };
  }, [slug]);

  // Fetch post list for prev/next navigation (index.json is newest-first)
  useEffect(() => {
    if (!slug) return;
    fetchPostList().then(posts => {
      const idx = posts.findIndex(p => p.slug === slug);
      if (idx === -1) return;
      setNextPost(idx > 0 ? posts[idx - 1] : null);       // newer
      setPrevPost(idx < posts.length - 1 ? posts[idx + 1] : null); // older
    }).catch(() => {});
  }, [slug]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '2px solid #770ff5', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: '#888' }}>Loading post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Post not found</h2>
          <Link to="/blog" style={{ color: '#770ff5' }}>← Back to blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a1a1a', padding: '1rem 0' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 1.5rem' }}>
          <Link to="/blog" style={{ color: '#888', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Article */}
      <article style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
        {/* Category */}
        <div style={{ marginBottom: '1rem' }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em',
            color: '#770ff5', background: 'rgba(119,15,245,0.1)', padding: '0.25rem 0.625rem', borderRadius: 4,
          }}>
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '1.5rem', color: '#fff' }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2.5rem', color: '#888', fontSize: '0.8rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Calendar size={14} />
            {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <Clock size={14} />
            {post.read_time}
          </span>
          {post.authors && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <User size={14} />
              {post.authors}
            </span>
          )}
          {post.arxiv_url && (
            <a href={post.arxiv_url} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#770ff5', textDecoration: 'none' }}>
              <ExternalLink size={14} />
              arXiv:{post.arxiv_id}
            </a>
          )}
        </div>

        {/* Content */}
        <div style={{ lineHeight: 1.8, color: '#ccc', fontSize: '1rem' }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', marginTop: '2rem', marginBottom: '0.75rem' }}>{children}</h2>,
              h3: ({ children }) => <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#fff', marginTop: '1.5rem', marginBottom: '0.5rem' }}>{children}</h3>,
              p: ({ children }) => <p style={{ marginBottom: '1.25rem', color: '#ccc' }}>{children}</p>,
              a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#f5c518', textDecoration: 'underline' }}>{children}</a>,
              strong: ({ children }) => <strong style={{ color: '#fff', fontWeight: 600 }}>{children}</strong>,
              code: ({ children }) => <code style={{ background: '#1a1a1a', padding: '0.125rem 0.375rem', borderRadius: 3, fontSize: '0.875rem', color: '#a78bfa' }}>{children}</code>,
              blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid #770ff5', paddingLeft: '1rem', margin: '1.5rem 0', color: '#888' }}>{children}</blockquote>,
              img: ({ src, alt }) => <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: '0.5rem', margin: '1.5rem 0', background: '#fff', padding: '0.5rem', display: 'block' }} />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Prev / Next navigation */}
        {(prevPost || nextPost) && (
          <nav style={{ borderTop: '1px solid #1a1a1a', marginTop: '3rem', paddingTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              {prevPost && (
                <Link
                  to={`/blog/${prevPost.slug}`}
                  state={{ post: prevPost }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', textDecoration: 'none', padding: '1rem', borderRadius: 8, border: '1px solid #1e1e1e', background: '#0f0f0f', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#770ff5')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e1e')}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    <ArrowLeft size={12} /> Previous
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#ccc', lineHeight: 1.4 }}>{prevPost.title}</span>
                </Link>
              )}
            </div>
            <div>
              {nextPost && (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  state={{ post: nextPost }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.375rem', textDecoration: 'none', padding: '1rem', borderRadius: 8, border: '1px solid #1e1e1e', background: '#0f0f0f', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#770ff5')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#1e1e1e')}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Next <ArrowRight size={12} />
                  </span>
                  <span style={{ fontSize: '0.88rem', color: '#ccc', lineHeight: 1.4, textAlign: 'right' }}>{nextPost.title}</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </article>
    </div>
  );
}
