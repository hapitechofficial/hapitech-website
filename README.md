# hApItech - AI Marketing Company Website

A complete, production-ready website for hApItech, an AI-powered marketing company specializing in video ads, posters, songs, and website development.

## Features

- **Modern UI/UX**: Futuristic design with smooth animations and glassmorphism effects
- **AI-Powered Services**: Showcase of AI marketing tools and services
- **Responsive Design**: Fully responsive across all devices
- **SEO Optimized**: Built with Next.js for optimal performance and SEO
- **Authentication System**: Login, signup, password reset pages (ready for integration)
- **Dashboard**: User dashboard with project management and AI tools access
- **Blog System**: Dynamic blog with individual post pages
- **Contact Forms**: Functional contact forms with validation
- **Newsletter Integration**: Ready for email marketing integration
- **Chatbot**: Floating AI assistant with keyword-based responses

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

## Color Palette

- **Warm Orange**: #FF6B35 (creativity, energy)
- **Deep Magenta**: #9B1C31 (innovation, premium)
- **Teal**: #008080 (technology, trust)
- **Beige**: #F5F5DC (neutral background)
- **Charcoal**: #36454F (text, contrast)

## Project Structure

```
hapitech/
├── app/                    # Next.js App Router
│   ├── about/             # About page
│   ├── auth/              # Authentication pages
│   ├── blog/              # Blog listing and posts
│   ├── coming-soon/       # Future tools page
│   ├── contact/           # Contact page
│   ├── dashboard/         # User dashboard
│   ├── faq/               # FAQ page
│   ├── pricing/           # Pricing page
│   ├── portfolio/         # Portfolio/Work samples
│   ├── privacy/           # Privacy policy
│   ├── services/          # Services page
│   ├── terms/             # Terms & conditions
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header
│   ├── Footer.tsx         # Site footer
│   ├── Hero.tsx           # Hero section
│   └── chatbot/           # Chatbot component
├── lib/                   # Utility libraries
│   ├── mocks/             # API mocks
│   └── theme/             # Theme configuration
├── styles/                # Styling utilities
│   └── tokens/            # Design tokens
├── utils/                 # Helper functions
└── public/                # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hapitech
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## Environment Variables

Create a `.env.local` file for environment variables:

```env
# Add your environment variables here
# NEXTAUTH_SECRET=your-secret-key
# DATABASE_URL=your-database-url
```

## Future Integrations

- **Authentication**: NextAuth.js integration
- **Database**: Prisma with PostgreSQL
- **AI Services**: Gemini API integration
- **Payment**: Stripe integration
- **Email**: Newsletter signup
- **Analytics**: Google Analytics

## Company Information

- **Brand**: hApItech
- **Tagline**: "Use Tech Happily with hApItech"
- **Address**: 3rd Floor, New Bus Port, Palanpur – 385001
- **Email**: hapitechofficial@gmail.com
- **Phone**: +91 9510314431, +91 7016703159

## Services

1. **Video Ads** - ₹1,500/-
2. **Poster Ads** - ₹100/-
3. **Song/Jingle Creation** - ₹500/-
4. **Website Development** - Custom pricing

## AI Tools Documentation

### AI Poster Pro ✨

This document provides a comprehensive technical and functional overview of AI Poster Pro, an advanced advertisement design tool powered by the Gemini 2.5 Flash Image model.

#### 1. Overview

AI Poster Pro is a sophisticated web application designed to transform minimal user input—textual descriptions, brand names, and product photos—into high-fidelity, photorealistic advertisement posters. Unlike generic image generators, this tool is fine-tuned for the advertising industry, focusing on professional lighting, clean typography, and brand consistency.

#### 2. Core Features

- **Intelligent Layout Engine**: Automatically handles product placement, typography, and background generation.
- **Dual Campaign Modes**:
  - Professional: Focused on high-end, clean, corporate aesthetics.
  - Festival / Themed: Focused on cultural, seasonal, or event-specific aesthetics (e.g., Diwali, Christmas, Black Friday).
- **Multi-Source Product Context**: Accepts raw text descriptions, live product URLs for context, and up to 6 high-resolution product photos.
- **Advanced Image Editing**: The "Update Text" feature allows users to modify the text on a generated poster while maintaining the original layout and product placement.
- **Contact Detail Integration**: Automatically generates professional-looking footers or corner segments containing phone numbers, websites, and addresses.
- **Responsive Presets**: 10+ built-in presets for social media (Instagram, LinkedIn, Facebook) and print (Portrait Posters, Magazine Covers).

#### 3. The User Journey (Step-by-Step)

**Step 1: Canvas Selection (SizeSelector.tsx)**  
The app starts with a "Choose Your Canvas" screen.  
Action: User clicks on a preset (e.g., "Instagram Story").  
Behind the scenes: The app stores the specific aspectRatio (e.g., 9:16) required for the Gemini API. This ensures the final image perfectly fits the intended platform without cropping.

**Step 2: Input Configuration (InputForm.tsx)**  
Once a size is selected, the main interface opens. The input process is divided into four logical sections:  
- **Campaign Mode**: Switching to "Festival" reveals an extra field for the Festival Name. This significantly alters the AI's "mood" (e.g., adding fireworks for Diwali or snow for Christmas).  
- **Brand & Product Details**: Brand Name: Injected into the prompt as the primary typographic element. Description: The user describes the product's vibe. The AI uses this to create the background and the tagline.  
- **Contact Details**: Optional fields for Phone, Website, and Address. If filled, the system prompt instructs the AI to create a "Contact Strip" at the bottom of the design.  
- **Product Source & Assets**: Product URL: The AI analyzes the URL to understand the "target audience" and "product category." Product Photos: Users can upload multiple images. These are converted to Base64 and sent directly to the model as visual references. Brand Logo: If uploaded, the AI is instructed to place this as a watermark or primary branding element.

**Step 3: Generation & API Execution (geminiService.ts)**  
When the user clicks "Generate Poster":  
- **System Prompt Construction**: The app runs a complex logic to build a "System Instruction." It tells the AI it is a "World-class advertising designer" and provides strict rules: Use English only, Avoid uncanny AI looks, Focus on premium realism.  
- **Multimodal Input**: The app packs the text prompt, the product images (if any), and the logo into a single request.  
- **The Model Call**: A request is sent to gemini-2.5-flash-image.  
  - If creating from scratch: It sends the text and product images.  
  - If "Updating Text": It sends the previous generated image back to the model as a baseImage, instructing it to keep everything the same but rewrite the text.

**Step 4: Final Output & Management (PosterDisplay.tsx)**  
- **Loading State**: While the API processes (usually 5-15 seconds), the user sees rotating "Designer Status" messages to improve UX.  
- **Visual Display**: The high-res image is rendered in a container that matches the selected aspect ratio.  
- **Download**: A download button allows the user to save the image as a PNG directly.  
- **Iteration**: The user can now either "Update Text" (keeping the current design) or trigger a "New Generation" (starting fresh with a different layout).

#### 4. Technical Architecture Details

**The API Logic (generatePoster function)**  
The tool uses the @google/genai library. The request is structured as follows:  
- **Model**: gemini-2.5-flash-image.  
- **Modalities**: The request specifies responseModalities: [Modality.IMAGE].  
- **Config**: imageConfig is passed with the aspectRatio chosen in Step 1.

**Image-to-Image Editing**  
This is the most advanced feature. When onUpdateText is clicked:  
- The app takes the current generatedImage (a Base64 string).  
- It sends this as the first part of the contents array.  
- The system prompt is modified to say: "Keep the existing background and composition EXACTLY as they are. ONLY modify the text overlays."  
- This allows for a "Photoshop-like" experience where the user can tweak a tagline without losing the perfect product shot they just generated.

#### 5. Visual Standards

The app uses Tailwind CSS for a "Dark Mode" premium aesthetic.  
- **Indigo Accents**: Used for primary actions to convey a "High-Tech AI" feel.  
- **Glassmorphism**: The header and inputs use semi-transparent backgrounds to create depth.  
- **Animations**: animate-fade-in and hover:scale-105 are used throughout to make the interface feel responsive and alive.

#### 6. Summary of Buttons & Clicks

- **Size Presets**: Sets the technical dimensions.  
- **Campaign Switch**: Toggles between "Clean Professional" and "Vibrant Festival" logic.  
- **Upload Boxes**: Triggers browser file picker; generates local object URLs for instant preview.  
- **Generate Poster**: Aggregates all data and hits the Gemini API.  
- **Update Text & Keep Layout**: Re-runs the API using the current image as a template.  
- **New Generation**: Ignores the current image and creates a brand-new layout.  
- **Reset All**: Clears the React state to start a new brand project.  
- **Download Icon**: Triggers an anchor tag download of the Base64 image data.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary to hApItech.

## Support

For support, contact us at hapitechofficial@gmail.com
