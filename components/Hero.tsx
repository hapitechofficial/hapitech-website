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
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Desktop/Tablet Background with Animated Shapes */}
        <div className="absolute inset-0 w-full h-full hidden sm:block bg-gradient-to-br from-beige via-orange/5 to-magenta/5">
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
        
        {/* Mobile Background - Optimized for Mobile Phones */}
        <div className="absolute inset-0 w-full h-full sm:hidden bg-gradient-to-b from-beige via-orange/20 to-beige">
          {/* Mobile animated accent bars */}
          <motion.div
            className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange via-magenta to-teal"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-40 h-40 rounded-full bg-teal opacity-10"
            animate={{
              scale: [1, 1.15, 1],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 left-0 w-32 h-32 rounded-full bg-orange opacity-10"
            animate={{
              scale: [1, 1.1, 1],
              x: [0, 30, 0],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-4 py-12 sm:py-0 w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-magenta via-orange to-teal bg-clip-text text-transparent leading-tight"
            animate={{ backgroundPosition: ['0%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            Use Tech Happily with hApItech
          </motion.h1>
        </motion.div>

        <motion.p
          className="text-sm sm:text-lg md:text-xl lg:text-2xl text-charcoal mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AI-powered marketing solutions that automate creativity, speed up production, and help your business grow.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center px-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <button
            onClick={handleCTAClick}
            className="bg-gradient-to-r from-orange to-magenta text-white px-4 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-xs sm:text-base md:text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Sparkles size={16} className="hidden sm:inline sm:w-[18px] sm:h-[18px]" />
            Create Magic
            <ArrowRight size={16} className="hidden sm:inline sm:w-[18px] sm:h-[18px]" />
          </button>
          <Link
            href="/pricing"
            className="border-2 border-magenta text-magenta px-4 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-xs sm:text-base md:text-lg hover:bg-magenta hover:text-white transition-all duration-300 w-full sm:w-auto"
          >
            View Pricing
          </Link>
          <button
            onClick={() => setShowSubscriptionModal(true)}
            className="bg-gradient-to-r from-teal to-magenta text-white px-4 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-xs sm:text-base md:text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Sparkles size={16} className="hidden sm:inline sm:w-[18px] sm:h-[18px]" />
            Get More Access
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator - Desktop Only */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
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