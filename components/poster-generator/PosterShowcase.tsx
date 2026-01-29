import React from 'react';

interface PosterShowcaseProps {
  result: any;
  onRegenerate: () => void;
}

export default function PosterShowcase({ result, onRegenerate }: PosterShowcaseProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200 p-8 max-w-2xl w-full relative">
        <h2 className="text-2xl font-serif font-bold mb-4 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Poster Showcase</h2>
        <div className="magazine-frame bg-white rounded-xl shadow-lg border border-gray-300 p-4 mb-6 flex items-center justify-center">
          <img src={result.posterUrl} alt="Generated Poster" className="w-full h-auto max-h-[60vh] object-contain rounded" />
        </div>
        <div className="flex gap-4 justify-center">
          <a href={result.posterUrl} download className="px-6 py-2 rounded-lg bg-gray-900 text-white font-semibold shadow hover:bg-gray-800 transition">Download HD</a>
          <button onClick={onRegenerate} className="px-6 py-2 rounded-lg border border-gray-900 text-gray-900 font-semibold bg-white shadow hover:bg-gray-100 transition">Regenerate</button>
        </div>
      </div>
    </div>
  );
}
