import { Metadata } from 'next';
import { MapPin, Phone, Mail } from 'lucide-react';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact hApItech - Get in Touch',
  description: 'Ready to transform your marketing with AI? Contact hApItech today for innovative solutions and creative excellence.',
};

export default function Contact() {

  return (
    <div className="min-h-screen bg-beige">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-xl text-center text-charcoal mb-12 max-w-2xl mx-auto">
          Ready to harness the power of AI for your marketing? Let's discuss how hApItech can help bring your vision to life.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-charcoal mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-magenta mr-4 mt-1" />
                  <div>
                    <div className="font-semibold text-charcoal">Address</div>
                    <div className="text-charcoal">3rd Floor, New Bus Port<br />Palanpur – 385001</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-magenta mr-4" />
                  <div>
                    <div className="font-semibold text-charcoal">Phone</div>
                    <div className="text-charcoal">+91 9510314431<br />+91 7016703159</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-magenta mr-4" />
                  <div>
                    <div className="font-semibold text-charcoal">Email</div>
                    <div className="text-charcoal">hapitechofficial@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">Why Choose hApItech?</h3>
              <ul className="space-y-2 text-charcoal">
                <li>• AI-powered creative solutions</li>
                <li>• Fast turnaround times</li>
                <li>• Competitive pricing</li>
                <li>• Professional quality guarantee</li>
                <li>• 24/7 customer support</li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}