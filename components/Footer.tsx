import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    company: [
      { name: 'About', href: '/about' },
      { name: 'Services', href: '/services' },
      { name: 'Portfolio', href: '/portfolio' },
      { name: 'Testimonials', href: '/testimonials' },
    ],
    support: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Contact', href: '/contact' },
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
    tools: [
      { name: 'Coming Soon', href: '/coming-soon' },
      { name: 'Blog', href: '/blog' },
      { name: 'Pricing', href: '/pricing' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://www.facebook.com/profile.php?id=61585315721187' },
    { name: 'Twitter', icon: Twitter, href: 'https://x.com/hApItech_IN?t=jrZ2FwCZZMEXIJ2n9T80Qg&s=09' },
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/hapitech_official?igsh=MWp2MTd0aXM5c3c4Yg==' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@hapitechoffical?si=NMvCuLtaYXjwuQ_C' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/in/harsh-patel-53b463367?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' },
  ];

  return (
    <footer className="bg-charcoal text-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-magenta mb-4">hApItech</h3>
            <p className="mb-4">
              Use Tech Happily with hApItech. AI-powered marketing solutions for modern businesses.
            </p>
            <div className="space-y-2 text-sm">
              <p>📍 3rd Floor, New Bus Port, Palanpur – 385001</p>
              <p>📧 hapitechofficial@gmail.com</p>
              <p>📞 +95 10314431 | +91 7016703159</p>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-orange transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-orange transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Links */}
          <div className="col-span-1 md:col-span-1">
            <h4 className="font-semibold mb-4">Tools</h4>
            <ul className="space-y-2">
              {footerLinks.tools.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-orange transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 pt-8 border-t border-gray-600">
          <div className="flex justify-center space-x-6">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-beige hover:text-orange transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon size={24} />
              </a>
            ))}
          </div>
          <p className="text-center mt-4 text-sm">
            © 2025 hApItech. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;