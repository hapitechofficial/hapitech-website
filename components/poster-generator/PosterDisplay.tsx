import React from 'react';
import { DownloadIcon, ImageIcon, WarningIcon } from './icons';

interface PosterDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

const loadingMessages = [
  "Analyzing your brand assets...",
  "Sketching initial concepts...",
  "Applying professional lighting and shadows...",
  "Adding the final polish...",
  "Crafting a catchy tagline...",
  "Finalizing the color palette..."
];

const LoadingState: React.FC = () => {
    const [messageIndex, setMessageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
             <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
             <p className="mt-4 text-lg font-semibold text-white">Generating your masterpiece...</p>
             <p className="text-gray-400 mt-2 transition-opacity duration-500">{loadingMessages[messageIndex]}</p>
        </div>
    );
};

const PosterDisplay: React.FC<PosterDisplayProps> = ({ generatedImage, isLoading, error }) => {
  return (
    <div className="bg-gray-800 p-2 rounded-2xl border border-gray-700 shadow-lg aspect-[3/4] flex items-center justify-center sticky top-24">
      <div className="w-full h-full bg-black/30 rounded-lg flex items-center justify-center">
        {isLoading && <LoadingState />}

        {error && !isLoading && (
          <div className="text-center p-8 space-y-4">
            <WarningIcon />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Thank you for choosing Hapitech!</h3>
              <p className="text-sm text-gray-300">We are sorry, we are experiencing a little bit of trouble on our end.</p>
              <p className="text-sm text-gray-300">{error}</p>
              <p className="text-xs text-gray-400 mt-3">Please try again in a few moments. We're working to improve your experience.</p>
            </div>
          </div>
        )}

        {!isLoading && !error && generatedImage && (
          <div className="relative w-full h-full group">
            <img src={generatedImage} alt="Generated Poster" className="w-full h-full object-contain rounded-lg" />
            <a
              href={generatedImage}
              download="ai-poster.png"
              className="absolute bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-indigo-700 transform hover:scale-110"
              aria-label="Download Poster"
            >
              <DownloadIcon />
            </a>
          </div>
        )}

        {!isLoading && !error && !generatedImage && (
          <div className="text-center text-gray-500 p-8">
            <ImageIcon />
            <h3 className="mt-4 text-lg font-semibold text-white">Your Poster Awaits</h3>
            <p className="mt-2 text-sm">Fill in the details on the left to create your professional poster.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterDisplay;