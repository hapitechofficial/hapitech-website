'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import SubscriptionModal from '@/components/poster-generator/SubscriptionModal';

const Hero = () => {
  const { data: session } = useSession();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleCTAClick = () => {
    if (session) {
      // User is logged in, redirect to poster generator
      window.location.href = '/tools/poster-generator';
    } else {
      // User is not logged in, redirect to login
      window.location.href = '/auth/login';
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-beige via-orange/5 to-magenta/5 overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-orange rounded-full opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-magenta rounded-full opacity-30"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-teal rounded-full opacity-25"
          animate={{
            x: [0, 120, 0],
            y: [0, -40, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 w-16 h-16 bg-orange rounded-full opacity-20"
          animate={{
            x: [0, -60, 0],
            y: [0, 80, 0],
            rotate: [0, -360],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-magenta via-orange to-teal bg-clip-text text-transparent"
            animate={{ backgroundPosition: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            Use Tech Happily with hApItech
          </motion.h1>
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-charcoal mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AI-powered marketing solutions that automate creativity, speed up production, and help your business grow.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            onClick={handleCTAClick}
            className="bg-gradient-to-r from-orange to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            Create Magic
            <ArrowRight size={20} />
          </button>
          <Link
            href="/pricing"
            className="border-2 border-magenta text-magenta px-8 py-4 rounded-full font-semibold text-lg hover:bg-magenta hover:text-white transition-all duration-300"
          >
            View Pricing
          </Link>
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="bg-gradient-to-r from-teal to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Sparkles size={20} />
            Get More Access
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-charcoal rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-charcoal rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>

    <SubscriptionModal
      isOpen={showSubscriptionModal}
      onClose={() => setShowSubscriptionModal(false)}
    />
    </>
  );
};

export default Hero;