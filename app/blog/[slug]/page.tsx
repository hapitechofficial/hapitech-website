import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'ai-marketing-revolution',
    title: 'The AI Marketing Revolution: How Technology is Transforming Creative Industries',
    content: `
      <p>The marketing landscape is undergoing a profound transformation, driven by the rapid advancement of artificial intelligence. What was once a labor-intensive process of brainstorming, creating, and refining marketing materials is now being augmented by sophisticated AI systems that can generate ideas, create content, and optimize campaigns with unprecedented speed and accuracy.</p>

      <h2>The Rise of AI in Marketing</h2>
      <p>Artificial intelligence has evolved from a futuristic concept to an essential tool in every marketer's arsenal. From predictive analytics that forecast consumer behavior to generative AI that creates compelling copy and visuals, AI is reshaping how brands connect with their audiences.</p>

      <h2>Automated Content Creation</h2>
      <p>One of the most significant impacts of AI in marketing is the automation of content creation. AI-powered tools can now generate blog posts, social media content, video scripts, and even design elements that rival human-created work in quality and creativity.</p>

      <h2>The Human-AI Partnership</h2>
      <p>Rather than replacing human creativity, AI is enhancing it. Marketers can now focus on strategic thinking and relationship building while AI handles the repetitive tasks of content generation and optimization.</p>

      <h2>Future Implications</h2>
      <p>As AI technology continues to advance, we can expect even more sophisticated applications in marketing, from hyper-personalized experiences to real-time campaign optimization that adapts to consumer behavior instantly.</p>
    `,
    author: 'hApItech Team',
    date: '2025-01-15',
    readTime: '5 min read',
  },
  {
    slug: 'future-video-advertising',
    title: 'The Future of Video Advertising: AI-Powered Storytelling',
    content: `
      <p>Video advertising is entering a new era where artificial intelligence is revolutionizing how brands tell their stories. From script generation to visual effects, AI is making professional-quality video production accessible to businesses of all sizes.</p>

      <h2>AI Script Generation</h2>
      <p>AI-powered tools can now analyze brand messaging and target audience data to generate compelling video scripts that resonate with viewers on an emotional level.</p>

      <h2>Automated Video Production</h2>
      <p>From stock footage selection to voiceover generation, AI is streamlining the entire video production pipeline, reducing costs and production time significantly.</p>

      <h2>Personalized Content</h2>
      <p>AI enables the creation of hyper-personalized video content that adapts to individual viewer preferences and behaviors, increasing engagement and conversion rates.</p>
    `,
    author: 'Marketing Experts',
    date: '2025-01-10',
    readTime: '4 min read',
  },
  // Add more posts as needed
];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - hApItech Blog`,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
  };
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link
          href="/blog"
          className="inline-flex items-center text-magenta hover:text-orange transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Link>

        <article className="bg-white rounded-lg shadow-lg p-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-sm text-teal space-x-4">
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <span>{post.readTime}</span>
            </div>
          </header>

          <div
            className="prose prose-lg max-w-none text-charcoal"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}