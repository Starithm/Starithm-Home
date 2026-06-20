import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import styled from 'styled-components';
import { fetchPostList, Post } from '../lib/posts';
import {
  BlogContainer,
  Header,
  HeaderContainer,
  HeaderTitle,
  HeaderSubtitle,
  Main,
  FeaturedPostSection,
  FeaturedPostCard,
  CategoryBadge,
  CategoryIcon,
  CategoryText,
  FeaturedPostTitle,
  FeaturedPostExcerpt,
  FeaturedPostFooter,
  PostMeta as PostMetaStyled,
  MetaItem,
  MetaIcon,
  BlogPostCardContainer,
  PostCardCategory,
  PostCardCategoryText,
  PostCardTitle,
  PostCardExcerpt,
  PostCardFooter,
  PostCardMeta,
  PostCardMetaItem,
  PostCardMetaIcon,
  PostCardLink
} from '../styled_components/BlogList.styled';

const POSTS_PER_PAGE = 12;

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 2rem;
  height: 2rem;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ $active }) => $active ? '#770ff5' : 'var(--border, #333)'};
  background: ${({ $active }) => $active ? '#770ff5' : 'transparent'};
  color: ${({ $active }) => $active ? 'white' : 'var(--foreground)'};
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
  &:hover:not(:disabled) { border-color: #770ff5; color: ${({ $active }) => $active ? 'white' : '#770ff5'}; }
  &:disabled { opacity: 0.3; cursor: default; }
`;

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPostList()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const pagePosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  return (
    <BlogContainer>
      <Header>
        <HeaderContainer>
          <HeaderTitle>Starithm Blog</HeaderTitle>
          <HeaderSubtitle>
            Updates, insights, and research for the astronomical community
          </HeaderSubtitle>
        </HeaderContainer>
      </Header>

      <Main>
        {/* Featured — Roadmap always pinned */}
        <FeaturedPostSection>
          <FeaturedPostCard>
            <CategoryBadge>
              <CategoryIcon><FileText size={20} /></CategoryIcon>
              <CategoryText>Roadmap</CategoryText>
            </CategoryBadge>
            <FeaturedPostTitle>
              Starithm Roadmap: Upcoming Features & Development Timeline
            </FeaturedPostTitle>
            <FeaturedPostExcerpt>
              Explore our comprehensive roadmap featuring upcoming features, improvements, and infrastructure updates planned for the Starithm platform.
            </FeaturedPostExcerpt>
            <FeaturedPostFooter>
              <PostMetaStyled>
                <MetaItem>
                  <MetaIcon><Calendar size={16} /></MetaIcon>
                  <span>Mar, 2026</span>
                </MetaItem>
                <MetaItem>
                  <MetaIcon><Clock size={16} /></MetaIcon>
                  <span>2 min read</span>
                </MetaItem>
              </PostMetaStyled>
              <Button asChild size="lg">
                <Link to="/blog/roadmap">
                  <span>Read Roadmap</span>
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </FeaturedPostFooter>
          </FeaturedPostCard>
        </FeaturedPostSection>

        {/* Research posts */}
        {loading && (
          <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Loading posts...</p>
        )}
        {!loading && posts.length > 0 && (
          <>
            <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', padding: '0 0 1.5rem' }}>
              {pagePosts.map(post => (
                <BlogPostCard key={post.slug} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0 2.5rem' }}>
                <PageButton disabled={page === 1} onClick={() => { setPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  ←
                </PageButton>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <PageButton
                    key={p}
                    $active={p === page}
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    {p}
                  </PageButton>
                ))}
                <PageButton disabled={page === totalPages} onClick={() => { setPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  →
                </PageButton>
              </div>
            )}
          </>
        )}
      </Main>
    </BlogContainer>
  );
}

function BlogPostCard({ post }: { post: Post }) {
  const cardRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);
  const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyTilt = (clientX: number, clientY: number) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (clientX - cx) / (rect.width / 2);
    const dy = (clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 8, y: dx * 8 });
    setShine({
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
    });
  };

  const resetTilt = () => {
    setTilt({ x: 0, y: 0 });
    setShine({ x: 50, y: 50 });
    setHovered(false);
  };

  // Mouse handlers (desktop)
  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => applyTilt(e.clientX, e.clientY);
  const handleMouseLeave = () => resetTilt();

  // Touch handlers (mobile)
  const handleTouchStart = (e: React.TouchEvent<HTMLElement>) => {
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    const touch = e.touches[0];
    setHovered(true);
    applyTilt(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLElement>) => {
    const touch = e.touches[0];
    applyTilt(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    // Brief delay so the animation is visible before resetting
    resetTimeoutRef.current = setTimeout(resetTilt, 350);
  };

  return (
    <BlogPostCardContainer
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => window.location.href = `/blog/posts/${post.slug}`}
      style={{
        cursor: 'pointer',
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${hovered ? 'translateY(-4px)' : ''}`,
        transition: hovered ? 'transform 0.1s ease-out, box-shadow 0.2s ease' : 'transform 0.4s ease, box-shadow 0.4s ease',
        boxShadow: hovered ? '0 20px 40px rgba(119, 15, 245, 0.15), 0 8px 16px rgba(0,0,0,0.2)' : undefined,
      }}
    >
      {/* Shine overlay */}
      {hovered && (
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.06) 0%, transparent 60%)`,
        }} />
      )}

      <PostCardCategory>
        <FileText size={16} />
        <PostCardCategoryText>{post.category}</PostCardCategoryText>
      </PostCardCategory>

      <PostCardTitle>{post.title}</PostCardTitle>

      <PostCardExcerpt>{post.excerpt}</PostCardExcerpt>

      <PostCardFooter>
        <PostCardMeta>
          <PostCardMetaItem>
            <PostCardMetaIcon><Calendar size={16} /></PostCardMetaIcon>
            <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </PostCardMetaItem>
          <PostCardMetaItem>
            <PostCardMetaIcon><Clock size={16} /></PostCardMetaIcon>
            <span>{post.read_time}</span>
          </PostCardMetaItem>
        </PostCardMeta>

        <PostCardLink to={`/blog/posts/${post.slug}`} state={{ post }}>
          <span>Read more</span>
          <ArrowRight size={16} />
        </PostCardLink>
      </PostCardFooter>
    </BlogPostCardContainer>
  );
}
