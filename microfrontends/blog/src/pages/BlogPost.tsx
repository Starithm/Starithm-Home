import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Calendar, Clock, User, ExternalLink } from 'lucide-react';
import { fetchPost, Post } from '../lib/posts';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchPost(slug)
      .then(p => {
        setPost(p);
        if (p) document.title = `${p.title} — Starithm Blog`;
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
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
              a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#770ff5', textDecoration: 'underline' }}>{children}</a>,
              strong: ({ children }) => <strong style={{ color: '#fff', fontWeight: 600 }}>{children}</strong>,
              code: ({ children }) => <code style={{ background: '#1a1a1a', padding: '0.125rem 0.375rem', borderRadius: 3, fontSize: '0.875rem', color: '#a78bfa' }}>{children}</code>,
              blockquote: ({ children }) => <blockquote style={{ borderLeft: '3px solid #770ff5', paddingLeft: '1rem', margin: '1.5rem 0', color: '#888' }}>{children}</blockquote>,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
