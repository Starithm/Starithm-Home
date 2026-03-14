import React, { useEffect, useState } from 'react';
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
  return (
    <BlogPostCardContainer>
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
