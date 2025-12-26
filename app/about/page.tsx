import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About hApItech - AI Marketing Innovation',
  description: 'Learn about hApItech\'s mission to revolutionize marketing with AI-powered tools and creative solutions.',
};

export default function About() {
  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
          About hApItech
        </h1>

        <div className="prose prose-lg max-w-none text-charcoal">
          <p className="text-xl leading-relaxed mb-8">
            In a world where technology evolves at lightning speed, hApItech stands at the forefront of marketing innovation.
            We are not just a company; we are visionaries who believe that artificial intelligence can transform the way businesses
            connect with their audiences.
          </p>

          <p className="leading-relaxed mb-8">
            Founded with the mission to "Use Tech Happily," hApItech harnesses the power of AI to automate creativity and streamline
            marketing processes. Our cutting-edge tools empower businesses of all sizes to produce stunning video ads, eye-catching
            posters, and memorable jingles in a fraction of the time traditional methods require.
          </p>

          <p className="leading-relaxed mb-8">
            We envision a future where marketing is no longer a bottleneck but a catalyst for growth. By integrating AI-driven
            creativity with human insight, we help entrepreneurs and marketers focus on strategy while our technology handles
            the heavy lifting of content creation.
          </p>

          <p className="leading-relaxed mb-8">
            Our commitment to innovation is unwavering. We continuously push the boundaries of what's possible, developing tools
            that not only meet today's needs but anticipate tomorrow's challenges. Speed, reliability, and exceptional quality
            are the cornerstones of everything we do.
          </p>

          <p className="leading-relaxed mb-8">
            At hApItech, we believe that technology should enhance human potential, not replace it. That's why our AI tools are
            designed to augment creativity, providing a foundation upon which marketers can build truly remarkable campaigns.
          </p>

          <p className="leading-relaxed mb-8">
            Join us on this exciting journey as we redefine the landscape of digital marketing. With hApItech, the future of
            marketing is here – innovative, efficient, and incredibly powerful.
          </p>

          <p className="leading-relaxed">
            Experience the joy of using technology that works for you. Welcome to hApItech – where AI meets creativity, and
            marketing becomes an adventure in innovation.
          </p>
        </div>
      </div>
    </div>
  );
}