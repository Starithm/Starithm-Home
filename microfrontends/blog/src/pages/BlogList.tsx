import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, FileText } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
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

export default function BlogList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostList()
      .then(setPosts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', padding: '0 0 2rem' }}>
            {posts.map(post => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
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

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 8, y: dx * 8 });
    setShine({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setShine({ x: 50, y: 50 });
    setHovered(false);
  };

  return (
    <BlogPostCardContainer
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
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
