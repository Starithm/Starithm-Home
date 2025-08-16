import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, FileText } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Starithm Roadmap: Upcoming Features & Development Timeline',
    excerpt: 'Explore our comprehensive roadmap featuring upcoming features, improvements, and infrastructure updates planned for the Starithm platform.',
    date: '2025-01-15',
    readTime: '5 min read',
    category: 'Roadmap',
    slug: 'roadmap'
  },
  {
    id: '2',
    title: 'Introducing NovaTrace: Real-Time Astronomical Event Intelligence',
    excerpt: 'Learn about our new NovaTrace dashboard that provides real-time monitoring and analysis of astronomical events from global observatories.',
    date: '2025-01-10',
    readTime: '8 min read',
    category: 'Product',
    slug: 'novatrace-introduction'
  },
  {
    id: '3',
    title: 'The Future of Astronomical Data Collaboration',
    excerpt: 'Discover how Starithm is revolutionizing the way astronomers collaborate and share data across the global research community.',
    date: '2025-01-05',
    readTime: '6 min read',
    category: 'Vision',
    slug: 'astronomical-collaboration'
  }
];

export default function BlogList() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-starithm-electric-violet to-starithm-veronica text-white py-12">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Starithm Blog</h1>
          <p className="text-xl text-starithm-electric-violet/80 max-w-2xl mx-auto">
            Updates, insights, and roadmap for the astronomical community
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-6 lg:px-8 py-12">
        {/* Featured Post */}
        <div className="mb-12">
          {/* <h2 className="text-2xl font-bold text-starithm-rich-black mb-6">Featured Article</h2> */}
          <div className="bg-gradient-to-br from-starithm-electric-violet/5 to-starithm-veronica/5 rounded-2xl p-8 border border-starithm-electric-violet/20">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-starithm-electric-violet" />
              <span className="text-sm font-medium text-starithm-electric-violet">Roadmap</span>
            </div>
            <h3 className="text-2xl font-bold text-starithm-rich-black mb-4">
              Starithm Roadmap: Upcoming Features & Development Timeline
            </h3>
            <p className="text-starithm-rich-black/70 mb-6 text-lg leading-relaxed">
              Explore our comprehensive roadmap featuring upcoming features, improvements, and infrastructure updates planned for the Starithm platform. 
              From real-time notifications to advanced data visualization, discover what's coming next.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-starithm-rich-black/60">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>January 15, 2025</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>5 min read</span>
                </div>
              </div>
              <Link 
                to="/roadmap"
                className="inline-flex items-center space-x-2 bg-starithm-electric-violet text-white px-6 py-3 rounded-lg hover:bg-starithm-electric-violet/90 transition-colors"
              >
                <span>Read Roadmap</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* All Posts
        <div>
          <h2 className="text-2xl font-bold text-starithm-rich-black mb-6">All Articles</h2>
          <div className="grid gap-8">
            {blogPosts.map(post => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        {/* <div className="mt-16 bg-gradient-to-r from-starithm-electric-violet/5 to-starithm-veronica/5 rounded-2xl p-8 border border-starithm-electric-violet/20">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-starithm-rich-black mb-4">
              Stay Updated
            </h3>
            <p className="text-starithm-rich-black/70 mb-6 max-w-2xl mx-auto">
              Get notified about new features, updates, and astronomical discoveries. 
              Join our community of researchers and enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-starithm-electric-violet focus:border-transparent min-w-64"
              />
              <button className="bg-starithm-electric-violet text-white px-6 py-3 rounded-lg hover:bg-starithm-electric-violet/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div> */}
      </main>
    </div>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="h-4 w-4 text-starithm-electric-violet" />
        <span className="text-sm font-medium text-starithm-electric-violet">{post.category}</span>
      </div>
      
      <h3 className="text-xl font-bold text-starithm-rich-black mb-3">
        {post.title}
      </h3>
      
      <p className="text-starithm-rich-black/70 mb-4 leading-relaxed">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-starithm-rich-black/60">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(post.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{post.readTime}</span>
          </div>
        </div>
        
        <Link 
          to={`/${post.slug}`}
          className="inline-flex items-center space-x-2 text-starithm-electric-violet hover:text-starithm-electric-violet/80 transition-colors"
        >
          <span className="font-medium">Read more</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
