import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, FileText } from 'lucide-react';
// import { ThemeToggle } from '@shared/components/ThemeToggle';
import { Button } from '@shared/components/ui/button';
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
  PostMeta,
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

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

export default function BlogList() {
  return (
    <BlogContainer>
      {/* Header */}
      <Header>
        <HeaderContainer>
          <HeaderTitle>Starithm Blog</HeaderTitle>
          <HeaderSubtitle>
            Updates, insights, and roadmap for the astronomical community
          </HeaderSubtitle>
        </HeaderContainer>
      </Header>

      {/* Content */}
      <Main>
        {/* Featured Post */}
        <FeaturedPostSection>
          <FeaturedPostCard>
            <CategoryBadge>
              <CategoryIcon>
                <FileText size={20} />
              </CategoryIcon>
              <CategoryText>Roadmap</CategoryText>
            </CategoryBadge>
            <FeaturedPostTitle>
              Starithm Roadmap: Upcoming Features & Development Timeline
            </FeaturedPostTitle>
            <FeaturedPostExcerpt>
              Explore our comprehensive roadmap featuring upcoming features, improvements, and infrastructure updates planned for the Starithm platform. 
              From real-time notifications to advanced data visualization, discover what's coming next.
            </FeaturedPostExcerpt>
            <FeaturedPostFooter>
              <PostMeta>
                <MetaItem>
                  <MetaIcon>
                    <Calendar size={16} />
                  </MetaIcon>
                  <span>Aug, 2025</span>
                </MetaItem>
                <MetaItem>
                  <MetaIcon>
                    <Clock size={16} />
                  </MetaIcon>
                  <span>2 min read</span>
                </MetaItem>
              </PostMeta>
              <Button asChild size="lg">
                <Link to="/blog/roadmap">
                  <span>Read Roadmap</span>
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </FeaturedPostFooter>
          </FeaturedPostCard>
        </FeaturedPostSection>
      </Main>
    </BlogContainer>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <BlogPostCardContainer>
      <PostCardCategory>
        <FileText size={16} />
        <PostCardCategoryText>{post.category}</PostCardCategoryText>
      </PostCardCategory>
      
      <PostCardTitle>
        {post.title}
      </PostCardTitle>
      
      <PostCardExcerpt>
        {post.excerpt}
      </PostCardExcerpt>
      
      <PostCardFooter>
        <PostCardMeta>
          <PostCardMetaItem>
            <PostCardMetaIcon>
              <Calendar size={16} />
            </PostCardMetaIcon>
            <span>{new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </PostCardMetaItem>
          <PostCardMetaItem>
            <PostCardMetaIcon>
              <Clock size={16} />
            </PostCardMetaIcon>
            <span>{post.readTime}</span>
          </PostCardMetaItem>
        </PostCardMeta>
        
        <PostCardLink to={`/${post.slug}`}>
          <span>Read more</span>
          <ArrowRight size={16} />
        </PostCardLink>
      </PostCardFooter>
    </BlogPostCardContainer>
  );
}
