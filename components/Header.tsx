'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Our AI Tools', href: '/tools/poster-generator' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
  ];

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleCTAClick = () => {
    if (session) {
      window.location.href = '/tools/poster-generator';
    } else {
      window.location.href = '/auth/login';
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-magenta">
            hApItech
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-charcoal dark:text-white hover:text-magenta transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-6 h-6 border-2 border-magenta border-t-transparent rounded-full animate-spin" />
            ) : session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-charcoal hover:text-magenta transition-colors"
                >
                  <User size={20} />
                  <span>{session.user?.name || session.user?.email}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-charcoal hover:text-magenta transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-charcoal hover:text-magenta transition-colors"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleCTAClick}
                  className="bg-gradient-to-r from-orange to-magenta text-white px-6 py-2 rounded-full hover:shadow-lg transition-shadow"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-charcoal dark:text-white hover:text-magenta transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4"
            >
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-charcoal hover:text-magenta py-2 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}

                {/* Mobile Auth Section */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {status === 'loading' ? (
                    <div className="flex justify-center py-2">
                      <div className="w-6 h-6 border-2 border-magenta border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : session ? (
                    <div className="space-y-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center space-x-2 text-charcoal hover:text-magenta py-2 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User size={20} />
                        <span>{session.user?.name || session.user?.email}</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsOpen(false);
                        }}
                        className="flex items-center space-x-2 text-charcoal hover:text-magenta py-2 transition-colors w-full text-left"
                      >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        href="/auth/login"
                        className="text-charcoal hover:text-magenta py-2 transition-colors block"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign In
                      </Link>
                      <button
                        onClick={() => {
                          handleCTAClick();
                          setIsOpen(false);
                        }}
                        className="bg-gradient-to-r from-orange to-magenta text-white px-6 py-2 rounded-full text-center w-full"
                      >
                        Get Started
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;