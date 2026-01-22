'use client';

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "👋 Hi! I'm hApItech's AI assistant. I can help you with:\n\n🎨 Poster generation guide\n💎 Subscription plans & pricing\n🚀 Our services & features\n📞 Contact information\n🔐 Account setup\n\nWhat would you like to know?", isUser: false }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), text: input, isUser: true };
    setMessages(prev => [...prev, userMessage]);

    // Simple keyword-based responses
    const response = getResponse(input.toLowerCase());
    const botMessage: Message = { id: Date.now() + 1, text: response, isUser: false };
    setMessages(prev => [...prev, botMessage]);

    setInput('');
  };

  const getResponse = (query: string): string => {
    // Normalize query for better matching
    const normalizedQuery = query.toLowerCase().trim();

    // Fuzzy search options
    const fuseOptions = { threshold: 0.4 }; // Lower threshold for stricter matching

    // Helper function for fuzzy keyword matching
    const hasMatch = (searchQuery: string, keywords: string[]): boolean => {
      const fuse = new Fuse(keywords, fuseOptions);
      const result = fuse.search(searchQuery);
      return result.length > 0;
    };

    // Poster Generation Keywords
    const posterKeywords = ['poster', 'generate', 'create', 'ai poster', 'poster generator', 'make poster', 'design poster', 'poster maker', 'ai tool', 'tool'];
    const hasPosterKeyword = hasMatch(normalizedQuery, posterKeywords);

    // Subscription Keywords
    const subscriptionKeywords = ['subscription', 'subscribe', 'premium', 'plan', 'pricing', 'price', 'cost', 'payment', 'pay', 'upgrade', 'pro', 'membership'];
    const hasSubscriptionKeyword = hasMatch(normalizedQuery, subscriptionKeywords);

    // Service Keywords
    const serviceKeywords = ['service', 'services', 'offer', 'offering', 'what do you do', 'what you offer', 'features', 'capability', 'can you'];
    const hasServiceKeyword = hasMatch(normalizedQuery, serviceKeywords);

    // Contact Keywords
    const contactKeywords = ['contact', 'email', 'phone', 'address', 'reach', 'support', 'help', 'call', 'message'];
    const hasContactKeyword = hasMatch(normalizedQuery, contactKeywords);

    // Company Keywords
    const companyKeywords = ['company', 'hapitech', 'about', 'who are you', 'what is', 'business'];
    const hasCompanyKeyword = hasMatch(normalizedQuery, companyKeywords);

    // Login/Signup Keywords
    const authKeywords = ['login', 'signup', 'sign up', 'register', 'account', 'user', 'join'];
    const hasAuthKeyword = hasMatch(normalizedQuery, authKeywords);

    // Handle Poster Generation Questions
    if (hasPosterKeyword || normalizedQuery.includes('how to') && (normalizedQuery.includes('poster') || normalizedQuery.includes('generate'))) {
      return `🎨 **How to Generate AI Posters - Step by Step:**

1. **Click on "Tools"** in the navigation menu
2. **Select "Poster Generator"** from the tools page
3. **Choose Canvas Size**: Select your preferred aspect ratio (16:9, 1:1, 4:3, etc.)
4. **Fill Brand Details**:
   - Brand Name (required)
   - Brand Description (required)
   - Product URL (optional)
5. **Upload Assets**:
   - Product Images (upload 1-5 product photos)
   - Brand Logo (optional PNG format)
6. **Campaign Settings**:
   - Campaign Mode: Commercial, Festival, or Event
   - For Festivals: Specify festival name
7. **Contact Information** (optional):
   - Phone number
   - Website URL
   - Business address
8. **Generate Poster**: Click the generate button!

**Pro Tips:**
• Use high-quality product images for best results
• Write detailed descriptions for better AI results
• Premium users get 5 posters per day
• Free users can try with credits

Need help with any step? Just ask! 🚀`;
    }

    // Handle Subscription Questions
    if (hasSubscriptionKeyword || normalizedQuery.includes('how to') && normalizedQuery.includes('subscribe')) {
      return `💎 **How to Get Premium Subscription - Step by Step:**

**Available Plans:**
• **Monthly Plan**: ₹999/month
• **Yearly Plan**: ₹9,999/year (2 months FREE!)

**Premium Benefits:**
✅ Generate 5 posters per day
✅ Priority customer support
✅ Commercial usage rights
✅ High-resolution downloads
✅ Advanced AI features

**How to Subscribe:**

1. **Go to Dashboard** → Click "Subscription" tab
2. **Choose Your Plan**: Monthly or Yearly
3. **Click "Subscribe Now"** button
4. **Complete Payment**: Secure Stripe checkout
5. **Instant Access**: Premium features activated immediately

**Payment Methods:**
• Credit/Debit Cards (Visa, MasterCard, etc.)
• UPI, Net Banking, Wallets
• Secure SSL encryption

**Subscription Management:**
• Cancel anytime from dashboard
• Upgrade/downgrade plans
• View billing history
• Auto-renewal settings

**Free Trial:** Get 10 credits to try our services!

Questions about billing? Contact us anytime! 💳`;
    }

    // Handle Service Questions
    if (hasServiceKeyword) {
      return `🚀 **hApItech Services - Complete Overview:**

**🎨 AI Poster Generator (₹100 per poster)**
• Professional advertisement posters
• Multiple aspect ratios (16:9, 1:1, 4:3, etc.)
• Commercial & festival themes
• Brand logo integration
• Contact info placement

**📹 Video Ads (₹1,500)**
• AI-powered video advertisements
• Custom scripts and voiceovers
• Multiple formats and durations
• Professional editing

**🎵 AI Song/Jingle Creation (₹500)**
• Original music for commercials
• Custom lyrics and melodies
• Multiple genres and styles
• Professional production

**💻 Website Development**
• Custom business websites
• E-commerce platforms
• Responsive design
• SEO optimization
• Price based on requirements

**🔥 Coming Soon:**
• AI Video Ad Maker
• AI Song Generator
• Advanced analytics dashboard

**Why Choose hApItech?**
✅ AI-powered automation
✅ Professional quality
✅ Fast turnaround
✅ Affordable pricing
✅ 24/7 support

Ready to get started? Visit our Tools page! 🎯`;
    }

    // Handle Pricing Questions
    if (normalizedQuery.includes('pricing') || normalizedQuery.includes('price') || normalizedQuery.includes('cost') || normalizedQuery.includes('rate') || normalizedQuery.includes('fee')) {
      return `💰 **hApItech Pricing - Transparent & Affordable:**

**🎨 AI Poster Generation:**
• Per Poster: ₹100
• Premium Subscription: ₹999/month
• Yearly Plan: ₹9,999/year (Save ₹989!)

**📹 Video Ads:**
• Professional Video Ad: ₹1,500
• Custom scripting included
• Multiple revisions

**🎵 AI Song/Jingle:**
• Original Song: ₹500
• Custom lyrics: +₹200
• Professional mixing: +₹300

**💻 Website Development:**
• Basic Website: ₹5,000 - ₹15,000
• E-commerce: ₹25,000 - ₹75,000
• Custom Features: Quoted per project

**🎁 Free Credits:**
• New users: 10 free credits
• Referral bonus: 5 credits per referral
• Social media share: 2 credits

**💳 Payment Options:**
• All major credit/debit cards
• UPI, Net Banking, Wallets
• Secure Stripe payment gateway
• Instant processing

**💎 Premium Benefits:**
• 5 posters per day
• Priority support
• Commercial usage
• High-resolution downloads

Need a custom quote? Contact us! 📞`;
    }

    // Handle Contact Questions
    if (hasContactKeyword) {
      return `📞 **Contact hApItech - We're Here to Help!**

**📧 Email:**
• General: hapitechofficial@gmail.com
• Support: support@hapitech.com
• Business: business@hapitech.com

**📱 Phone/WhatsApp:**
• +91 7016703159 (Primary)
• +91 9510314431 (International)

**🏢 Office Address:**
• 3rd Floor, New Bus Port
• Palanpur – 385001
• Gujarat, India

**🕒 Business Hours:**
• Monday - Saturday: 9:00 AM - 8:00 PM IST
• Sunday: 10:00 AM - 4:00 PM IST
• 24/7 Emergency Support

**💬 Quick Response:**
• Email: Within 2-4 hours
• WhatsApp: Instant response
• Phone: Mon-Fri 10 AM - 6 PM

**🌐 Social Media:**
• Instagram: @hapitechofficial
• LinkedIn: hApItech
• Twitter: @hapitech_ai

Need urgent help? WhatsApp us now! 🚀`;
    }

    // Handle Company/About Questions
    if (hasCompanyKeyword) {
      return `🏢 **About hApItech - AI Marketing Revolution**

**Who We Are:**
hApItech is a cutting-edge AI marketing company revolutionizing how businesses create marketing content. We automate the entire marketing process using advanced artificial intelligence.

**🎯 Our Mission:**
"Empowering businesses with AI-driven marketing solutions that deliver professional results at affordable prices."

**🚀 What We Do:**
• AI-powered poster generation
• Automated video advertisement creation
• Original song and jingle composition
• Custom website development
• Digital marketing automation

**💡 Our Technology:**
• Google Gemini AI for content generation
• Advanced machine learning algorithms
• Professional design templates
• Cloud-based processing
• Secure data handling

**🏆 Why Choose Us:**
✅ 100% AI-automated process
✅ Professional quality output
✅ 50% faster than traditional methods
✅ 70% cost reduction
✅ 24/7 customer support
✅ Secure & reliable

**📈 Our Vision:**
To become the world's leading AI marketing platform, helping millions of businesses worldwide create stunning marketing content effortlessly.

**🌟 Our Values:**
• Innovation through AI
• Customer-first approach
• Transparency in pricing
• Quality over quantity
• Continuous improvement

Founded in 2024, hApItech has already helped 1000+ businesses transform their marketing! 🌟`;
    }

    // Handle Authentication Questions
    if (hasAuthKeyword) {
      return `🔐 **How to Create Account & Login:**

**Quick Signup Process:**
1. **Click "Login"** in the top navigation
2. **Choose "Sign Up"** option
3. **Select Google Sign-in** (recommended)
4. **Grant permissions** to your Google account
5. **Complete profile** (optional)
6. **Get 10 free credits** instantly!

**Alternative Signup:**
• Email registration (coming soon)
• Social media login (expanding)

**Login Methods:**
✅ Google OAuth (fastest)
✅ Email & password (secure)
✅ Social login (convenient)

**Account Benefits:**
🎁 10 free credits for new users
📊 Usage tracking dashboard
💳 Easy subscription management
📧 Important updates & offers
🎯 Personalized recommendations

**Security Features:**
🔒 SSL encrypted connections
🛡️ Google OAuth security
🔐 Secure password storage
📱 Two-factor authentication (soon)

**Need Help?**
• Forgot password? Contact support
• Account issues? Email us
• Technical problems? WhatsApp support

Get started in under 30 seconds! 🚀`;
    }

    // Handle Common Questions
    if (normalizedQuery.includes('how') && normalizedQuery.includes('work')) {
      return `🤔 **How hApItech Works - Simple 3-Step Process:**

**Step 1: Choose Your Service**
• Visit our Tools page
• Select what you need (Poster, Video, Song, Website)
• Pick your plan

**Step 2: Provide Details**
• Fill in your requirements
• Upload assets (images, logos, etc.)
• Add branding information

**Step 3: Get Results**
• AI processes your request
• Receive professional output
• Download and use immediately

**That's it! No complex software, no learning curve, just results!** ✨

Need help with any step? Ask me!`;
    }

    if (normalizedQuery.includes('free') || normalizedQuery.includes('trial')) {
      return `🎁 **Free Trial & Credits System:**

**New User Benefits:**
✅ 10 free credits on signup
✅ No credit card required
✅ Full access to all features
✅ Professional quality output

**How to Get Free Credits:**
• Sign up with Google: +10 credits
• Refer a friend: +5 credits each
• Share on social media: +2 credits
• Complete profile: +3 bonus credits

**What You Can Do With Free Credits:**
• Generate 10 posters (₹100 each)
• Create 2 video ads (₹1,500 each)
• Make 20 songs (₹500 each)
• Mix and match services

**Upgrade Anytime:**
• No expiration on credits
• Easy upgrade to premium
• Keep unused credits
• Premium benefits activate instantly

**Credit Usage Examples:**
• 1 Poster = 1 credit
• 1 Video Ad = 15 credits
• 1 Song = 5 credits
• Website = Custom quote

Ready to start? Sign up now! 🚀`;
    }

    // Default responses for unrecognized queries
    const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'];
    if (greetings.some(greet => normalizedQuery.includes(greet))) {
      return "Hello! 👋 I'm hApItech's AI assistant. I can help you with:\n\n🎨 How to generate AI posters\n💎 Subscription plans & pricing\n🚀 Our services & features\n📞 Contact information\n🔐 Account setup\n\nWhat would you like to know?";
    }

    const thanks = ['thank', 'thanks', 'thx', 'appreciate'];
    if (thanks.some(thank => normalizedQuery.includes(thank))) {
      return "You're welcome! 😊 Happy to help. Feel free to ask if you need anything else about hApItech's AI marketing tools!";
    }

    // Fallback response
    return `🤖 **I'm here to help with hApItech!**

I can assist you with:
🎨 **Poster Generation**: Step-by-step guide to create AI posters
💎 **Subscriptions**: Plans, pricing, and how to subscribe
🚀 **Services**: All our AI marketing tools and features
📞 **Contact**: How to reach our support team
🔐 **Account**: Signup, login, and account management
💰 **Pricing**: Complete pricing breakdown
🏢 **About Us**: Company information and mission

**Try asking:**
• "How do I generate a poster?"
• "What are your subscription plans?"
• "How much does it cost?"
• "How do I contact support?"
• "Tell me about your services"

What specific question can I help you with? 😊`;
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-magenta text-white p-4 rounded-full shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-20 right-6 w-80 h-96 bg-white rounded-lg shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-magenta text-white p-4 rounded-t-lg flex justify-between items-center">
              <h3 className="font-semibold">hApItech AI Assistant</h3>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-2 rounded-lg ${msg.isUser ? 'bg-magenta text-white' : 'bg-gray-100'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t flex">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border rounded-l px-2 py-1"
              />
              <button onClick={handleSend} className="bg-magenta text-white px-3 rounded-r">
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;