'use client';

import { useEffect, useState } from 'react';
import { Play, Image as ImageIcon, Music } from 'lucide-react';
import { prisma } from '@/lib/prisma';

// Default portfolio items as fallback
type PortfolioItemType = {
  id?: string;
  type: string;
  title: string;
  category: string;
  media: string;
  isVideo: boolean;
  pinned?: boolean;
};

const defaultPortfolioItems: PortfolioItemType[] = [
  // Diwali Festival Content
  {
    id: 'default-1',
    type: 'Video',
    title: 'Diwali Festival Celebration',
    category: 'Festival Content',
    media: '/assets/diwali final gujarat panel.mp4',
    isVideo: true,
  },
  {
    id: 'default-2',
    type: 'Poster',
    title: 'Gold & Purple Diwali Greetings',
    category: 'Festival Posters',
    media: '/assets/Gold Modern Dhanteras Instagram Post.png',
    isVideo: false,
  },
  {
    id: 'default-3',
    type: 'Poster',
    title: 'Blue & Yellow Diwali Celebration',
    category: 'Festival Posters',
    media: '/assets/Blue and Yellow Illustrative Happy Diwali Instagram Post.png',
    isVideo: false,
  },
  {
    id: 'default-4',
    type: 'Video',
    title: 'Diwali Song & Luck Video',
    category: 'Festival Videos',
    media: '/assets/diwali song video goodluck.mp4',
    isVideo: true,
  },
  // Navratri Content
  {
    id: 'default-5',
    type: 'Video',
    title: 'Colorful Navratri Garba Dance',
    category: 'Festival Content',
    media: '/assets/Colourful Navratri Festival Garba Dance Video.mp4',
    isVideo: true,
  },
  {
    id: 'default-6',
    type: 'Poster',
    title: 'Red & Brown Navratri Thumbnail',
    category: 'Festival Posters',
    media: '/assets/Red and Brown Traditional Chaitra Navratri YouTube Thumbnail.png',
    isVideo: false,
  },
  {
    type: 'Poster',
    title: 'Red & Purple Navratri Festival Banner',
    category: 'Festival Posters',
    media: '/assets/Red and Purple Illustrated Navratri Festival Banner Landscape.png',
    isVideo: false,
  },
  {
    type: 'Poster',
    title: 'Blue & White Navratri Greeting',
    category: 'Festival Posters',
    media: '/assets/Blue and White Illustrated Navratri Greeting Instagram Post.png',
    isVideo: false,
  },
  // Advertisement Videos
  {
    type: 'Video',
    title: 'Professional Ad Campaign',
    category: 'Advertisement',
    media: '/assets/FINAL AD.mp4',
    isVideo: true,
  },
  {
    type: 'Video',
    title: 'Premium AD Production',
    category: 'Advertisement',
    media: '/assets/1st final ad.mp4',
    isVideo: true,
  },
  // Diwali Special Content
  {
    type: 'Video',
    title: 'Red & Yellow Diwali Video',
    category: 'Festival Videos',
    media: '/assets/Red and Yellow Illustrative Happy Diwali Video.mp4',
    isVideo: true,
  },
  {
    type: 'Video',
    title: 'Purple & Gold Diwali Greetings Video',
    category: 'Festival Videos',
    media: '/assets/Purple and Gold Illustrated Diwali Greetings Video.mp4',
    isVideo: true,
  },
  {
    type: 'Video',
    title: 'Gold & Purple Mobile Video',
    category: 'Festival Videos',
    media: '/assets/Gold and Purple Illustrative Happy Diwali Mobile Video.mp4',
    isVideo: true,
  },
  {
    type: 'Poster',
    title: 'Orange & Black Diwali Wishes',
    category: 'Festival Posters',
    media: '/assets/Orange and Black Illustrative Happy Diwali Instagram Post.png',
    isVideo: false,
  },
  {
    type: 'Poster',
    title: 'Red & Orange Diwali Card',
    category: 'Festival Posters',
    media: '/assets/Red and Orange Illustrative Happy Diwali Card.png',
    isVideo: false,
  },
  {
    type: 'Poster',
    title: 'Purple & Yellow Diwali Post',
    category: 'Festival Posters',
    media: '/assets/Purple Yellow and Orange Simple Happy Diwali Facebook Post.png',
    isVideo: false,
  },
  // Special Videos
  {
    type: 'Video',
    title: 'Jalebi Diwali Oil Production',
    category: 'Product Videos',
    media: '/assets/jaleshawar oil diwali video.mp4',
    isVideo: true,
  },
  {
    type: 'Video',
    title: 'Gujarat Panel Content',
    category: 'Regional Content',
    media: '/assets/Final Hindi Ad of Gujarat Panel.mp4',
    isVideo: true,
  },
  {
    type: 'Video',
    title: 'Gujarat Song Production',
    category: 'Music Videos',
    media: '/assets/Gujarat Song Voideo.mp4',
    isVideo: true,
  },
  {
    type: 'Poster',
    title: 'Gujarat Panel Poster Design',
    category: 'Regional Content',
    media: '/assets/gujarat_panel_poster.png',
    isVideo: false,
  },
  {
    type: 'Video',
    title: 'Kisan Divas Celebration',
    category: 'Special Occasions',
    media: '/assets/kisan diwas.mp4',
    isVideo: true,
  },
  {
    type: 'Video',
    title: 'New Year 2026 Welcome Video',
    category: 'Seasonal Content',
    media: '/assets/welcome 2026.mp4',
    isVideo: true,
  },
  // Professional Posters
  {
    type: 'Poster',
    title: 'World Class Professional Poster',
    category: 'Professional Design',
    media: '/assets/world-class-ad-poster.png',
    isVideo: false,
  },
  {
    type: 'Poster',
    title: 'World Class Premium Design 1',
    category: 'Professional Design',
    media: '/assets/world-class-ad-poster (4).png',
    isVideo: false,
  },
  {
    type: 'Poster',
    title: 'World Class Premium Design 2',
    category: 'Professional Design',
    media: '/assets/world-class-ad-poster (5).png',
    isVideo: false,
  },
  {
    type: 'Poster',
    title: 'World Class Premium Design 3',
    category: 'Professional Design',
    media: '/assets/world-class-ad-poster (6).png',
    isVideo: false,
  },
];

export default function Portfolio() {
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [items, setItems] = useState(defaultPortfolioItems);

  useEffect(() => {
    // Fetch portfolio items from API
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/admin/portfolio/items');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            // Map database items to expected format
            const formattedItems = data.map((item: any) => ({
              id: item.id,
              title: item.title,
              category: item.category,
              type: item.type,
              media: item.media,
              isVideo: item.type.toLowerCase() === 'video',
              pinned: !!item.pinned,
              createdAt: item.createdAt,
            }));
            // Sort: pinned first, then by createdAt desc
            formattedItems.sort((a: any, b: any) => {
              if (a.pinned && !b.pinned) return -1;
              if (!a.pinned && b.pinned) return 1;
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setItems(formattedItems);
          }
        }
      } catch (error) {
        console.error('Error fetching portfolio items:', error);
        // Use default items on error
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige via-white to-beige">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-magenta to-orange bg-clip-text text-transparent">
          Our Portfolio
        </h1>
        <p className="text-lg md:text-xl text-center text-charcoal mb-12 max-w-2xl mx-auto">
          Discover our curated collection of professional marketing masterpieces including festival campaigns, product videos, and premium design work.
        </p>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedMedia(item)}
              className="group relative rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
            >
              {/* Media Container */}
              <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                {item.isVideo ? (
                  <>
                    <video
                      src={item.media}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <Play className="w-12 h-12 text-white fill-white opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </>
                ) : (
                  <>
                    <img
                      src={item.media}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                      <ImageIcon className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </>
                )}
                {item.pinned && (
                  <span className="absolute top-2 right-2 px-3 py-1 text-xs bg-orange text-white rounded-full font-semibold shadow">Pinned</span>
                )}
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="text-xs md:text-sm text-teal font-semibold mb-2 uppercase tracking-wide">
                  {item.category}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-charcoal group-hover:text-magenta transition-colors">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Media Modal */}
        {selectedMedia && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
              {/* Close Button */}
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 bg-magenta text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-orange transition-colors z-10"
              >
                ✕
              </button>

              {/* Media Display */}
              <div className="bg-black flex items-center justify-center min-h-[400px]">
                {selectedMedia.isVideo ? (
                  <video
                    src={selectedMedia.media}
                    controls
                    autoPlay
                    className="w-full h-auto max-h-[70vh]"
                  />
                ) : (
                  <img
                    src={selectedMedia.media}
                    alt={selectedMedia.title}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                )}
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="text-sm text-teal font-semibold mb-2 uppercase">
                  {selectedMedia.category}
                </div>
                <h2 className="text-3xl font-bold text-charcoal mb-4">
                  {selectedMedia.title}
                </h2>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mt-16">
          <p className="text-lg text-charcoal mb-6">
            Ready to create something amazing together?
          </p>
          <a
            href="/contact"
            className="bg-gradient-to-r from-orange to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-300 inline-block"
          >
            Start Your Project
          </a>
        </div>
      </div>
    </div>
  );
}