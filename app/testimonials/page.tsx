import { Metadata } from 'next';
import { Star, Quote } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Testimonials - What Our Clients Say About hApItech',
  description: 'Read testimonials from satisfied clients who have experienced the power of AI-driven marketing with hApItech.',
};

const testimonials = [
  {
    name: 'Sarah Johnson',
    position: 'Marketing Director, TechStart Inc.',
    content: 'hApItech transformed our marketing approach completely. Their AI-powered video ads increased our engagement by 300% in just two weeks. The quality and speed are unmatched!',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    position: 'Founder, Creative Solutions',
    content: 'The poster designs from hApItech are simply stunning. What used to take our design team days now gets done in hours, and the results are consistently impressive.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    position: 'Brand Manager, Fashion Forward',
    content: 'Their jingle creation service captured our brand essence perfectly. The AI technology combined with human creativity produced something truly magical.',
    rating: 5,
  },
  {
    name: 'David Kumar',
    position: 'CEO, Startup Ventures',
    content: 'As a startup, budget is crucial. hApItech\'s affordable pricing and high-quality output helped us compete with much larger companies. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Lisa Wang',
    position: 'Digital Marketing Lead, Global Corp',
    content: 'The website they developed for us is not only beautiful but also incredibly functional. Their AI tools integration has streamlined our entire marketing workflow.',
    rating: 5,
  },
  {
    name: 'Robert Taylor',
    position: 'Entrepreneur, Local Business',
    content: 'I was skeptical about AI in marketing, but hApItech proved me wrong. Their services are professional, reliable, and the results speak for themselves.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
          What Our Clients Say
        </h1>
        <p className="text-xl text-center text-charcoal mb-12 max-w-2xl mx-auto">
          Don't just take our word for it. Here's what our satisfied clients have to say about their experience with hApItech.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative"
            >
              <Quote className="w-8 h-8 text-magenta mb-4 opacity-50" />
              <p className="text-charcoal mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-orange fill-current" />
                ))}
              </div>
              <div>
                <div className="font-semibold text-charcoal">{testimonial.name}</div>
                <div className="text-sm text-teal">{testimonial.position}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-charcoal mb-6">
            Join thousands of satisfied clients who trust hApItech with their marketing needs.
          </p>
          <a
            href="/contact"
            className="bg-gradient-to-r from-orange to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300 inline-block"
          >
            Become Our Next Success Story
          </a>
        </div>
      </div>
    </div>
  );
}