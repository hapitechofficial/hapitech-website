import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Blog - hApItech Marketing Insights',
  description: 'Stay updated with the latest trends in AI marketing, creative strategies, and digital innovation from hApItech.',
};

interface BlogPostType {
  id?: string
  slug: string
  title: string
  excerpt: string
  author: string
  content?: string
  readTime: string
  createdAt: Date | string
}

async function getBlogPosts() {
  try {
    const posts = await (prisma as any).blogPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return posts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Fallback default posts if database is empty
const defaultBlogPosts: BlogPostType[] = [
  {
    id: 'default-1',
    slug: 'ai-marketing-revolution',
    title: 'The AI Marketing Revolution: How Technology is Transforming Creative Industries',
    excerpt: 'Explore how artificial intelligence is reshaping the marketing landscape, from automated content creation to predictive analytics that drive unprecedented results.',
    author: 'hApItech Team',
    content: 'Explore how artificial intelligence is reshaping the marketing landscape...',
    readTime: '5 min read',
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 'default-2',
    slug: 'future-video-advertising',
    title: 'The Future of Video Advertising: AI-Powered Storytelling',
    excerpt: 'Discover how AI is revolutionizing video content creation, enabling brands to produce compelling narratives at scale while maintaining authenticity and emotional impact.',
    author: 'Marketing Experts',
    content: 'Discover how AI is revolutionizing video content creation...',
    readTime: '4 min read',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 'default-3',
    slug: 'poster-design-ai',
    title: 'From Concept to Creation: AI in Poster Design',
    excerpt: 'Learn how artificial intelligence is democratizing design, allowing businesses of all sizes to create professional, eye-catching posters that convert viewers into customers.',
    author: 'Design Team',
    content: 'Learn how artificial intelligence is democratizing design...',
    readTime: '3 min read',
    createdAt: new Date('2025-01-05'),
  },
  {
    id: 'default-4',
    slug: 'audio-branding-power',
    title: 'The Power of Audio Branding in the Digital Age',
    excerpt: 'Understanding how memorable jingles and audio branding can create lasting connections with audiences in an increasingly visual world.',
    author: 'Audio Specialists',
    content: 'Understanding how memorable jingles and audio branding...',
    readTime: '6 min read',
    createdAt: new Date('2024-12-28'),
  },
  {
    id: 'default-5',
    slug: 'roi-ai-marketing',
    title: 'Measuring ROI: The True Value of AI Marketing Tools',
    excerpt: 'A comprehensive guide to quantifying the return on investment from AI-powered marketing solutions and strategies for maximizing your marketing budget.',
    author: 'Analytics Team',
    content: 'A comprehensive guide to quantifying the return on investment...',
    readTime: '7 min read',
    createdAt: new Date('2024-12-20'),
  },
  {
    id: 'default-6',
    slug: 'creative-automation',
    title: 'Creative Automation: Balancing AI Efficiency with Human Touch',
    excerpt: 'How to leverage AI tools while maintaining the authentic human creativity that resonates with audiences and builds genuine brand connections.',
    author: 'Strategy Consultants',
    content: 'How to leverage AI tools while maintaining the authentic human creativity...',
    readTime: '5 min read',
    createdAt: new Date('2024-12-15'),
  },
]

export default async function Blog() {
  const blogPosts = await getBlogPosts()
  // Sort: pinned first, then by date
  let postsToDisplay: BlogPostType[] = blogPosts.length > 0 ? blogPosts : defaultBlogPosts
  postsToDisplay = [
    ...postsToDisplay.filter((p) => p.pinned),
    ...postsToDisplay.filter((p) => !p.pinned),
  ]
  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
          Marketing Insights
        </h1>
        <p className="text-xl text-center text-charcoal mb-12 max-w-2xl mx-auto">
          Stay ahead of the curve with expert insights on AI marketing, creative strategies, and digital innovation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {postsToDisplay.map((post) => (
            <article
              key={post.id || post.slug}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-magenta to-orange flex items-center justify-center relative">
                <div className="text-white text-center">
                  <div className="text-4xl font-bold">{new Date(post.createdAt).getDate()}</div>
                  <div className="text-sm uppercase">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short' })}</div>
                </div>
                {post.pinned && (
                  <span className="absolute top-2 right-2 px-3 py-1 text-xs bg-orange text-white rounded-full font-semibold shadow">Pinned</span>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-charcoal mb-3 hover:text-magenta transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-charcoal text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-teal">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}