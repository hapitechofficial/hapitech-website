'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'What services does hApItech offer?',
    answer: 'hApItech specializes in AI-powered marketing solutions including video ad creation, poster design, song/jingle composition, and custom website or AI tool development. We use cutting-edge artificial intelligence to deliver professional-quality content quickly and affordably.',
  },
  {
    question: 'How does AI help in marketing content creation?',
    answer: 'Our AI systems analyze your brand requirements, target audience, and industry trends to generate creative content that resonates. From script writing to visual design, AI handles the heavy lifting while our team ensures the final output meets your quality standards and brand guidelines.',
  },
  {
    question: 'What are your typical turnaround times?',
    answer: 'Turnaround times vary by service: Poster ads are usually ready within 24 hours, video ads take 2-3 days, and audio content requires 3-5 days. Custom development projects are quoted individually based on complexity.',
  },
  {
    question: 'Do you provide revisions?',
    answer: 'Yes, we include up to 3 rounds of revisions with each project to ensure you\'re completely satisfied with the final result. Additional revisions can be accommodated for a small fee.',
  },
  {
    question: 'What file formats do you deliver?',
    answer: 'We provide files in multiple formats suitable for various platforms: videos in MP4, MOV, and WebM; posters in PDF, PNG, JPG, and AI formats; audio in MP3, WAV, and AAC. All files are high-resolution and ready for professional use.',
  },
  {
    question: 'Can I request custom work not listed in your services?',
    answer: 'Absolutely! We love taking on unique challenges. If you have a specific marketing need that isn\'t covered in our standard services, contact us to discuss custom solutions tailored to your requirements.',
  },
  {
    question: 'Do you offer bulk discounts?',
    answer: 'Yes, we provide volume discounts for clients ordering multiple services or recurring projects. Contact our team to discuss pricing for larger campaigns or ongoing partnerships.',
  },
  {
    question: 'What if I\'m not satisfied with the final product?',
    answer: 'Your satisfaction is our priority. If you\'re not happy with the final deliverable, we\'ll work with you to make it right. We offer a 100% satisfaction guarantee and will continue revisions until you\'re thrilled with the result.',
  },
  {
    question: 'How do I get started?',
    answer: 'Getting started is easy! Simply contact us through our website, email, or phone. We\'ll discuss your project requirements, provide a detailed quote, and begin creating amazing content for your brand.',
  },
  {
    question: 'What makes hApItech different from other marketing agencies?',
    answer: 'hApItech combines the speed and efficiency of AI technology with human creativity and expertise. This unique approach allows us to deliver professional-quality marketing content at a fraction of the traditional cost and time, without compromising on quality or brand alignment.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md">
          <button
            onClick={() => toggleFAQ(index)}
            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <span className="text-lg font-semibold text-charcoal">{faq.question}</span>
            {openIndex === index ? (
              <ChevronUp className="w-5 h-5 text-magenta" />
            ) : (
              <ChevronDown className="w-5 h-5 text-magenta" />
            )}
          </button>
          {openIndex === index && (
            <div className="px-6 pb-4">
              <p className="text-charcoal leading-relaxed">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}