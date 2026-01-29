"use client";
import React from 'react';

interface PosterShowcaseProps {
  result: any;
  onRegenerate: () => void;
}

export default function PosterShowcase({ result, onRegenerate }: PosterShowcaseProps) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[60vh]">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <svg width="100%" height="100%" className="w-full h-full" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="g1" cx="50%" cy="50%" r="80%" gradientTransform="rotate(20)">
              <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
            </radialGradient>
            <radialGradient id="g2" cx="80%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#f0abfc" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <ellipse cx="300" cy="200" rx="320" ry="180" fill="url(#g1)" />
          <ellipse cx="420" cy="120" rx="180" ry="100" fill="url(#g2)" />
        </svg>
      </div>
      <div className="glass rounded-3xl shadow-2xl border border-white/30 p-10 max-w-2xl w-full relative" style={{backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}}>
        <h2 className="text-3xl font-serif font-bold mb-8 text-gray-900 tracking-tight text-center" style={{ fontFamily: 'Playfair Display, serif' }}>Your Editorial Poster</h2>
        <div className="magazine-frame bg-gradient-to-br from-white/90 via-indigo-50 to-purple-50 rounded-2xl shadow-2xl border border-indigo-100 p-6 mb-8 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none rounded-2xl border-4 border-white/60" style={{boxShadow:'0 8px 32px 0 rgba(31,38,135,0.12)'}}></div>
          <img src={result.posterUrl} alt="Generated Poster" className="w-full h-auto max-h-[60vh] object-contain rounded-xl shadow-lg" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-2">
          <a href={result.posterUrl} download className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-xl text-lg tracking-wide hover:scale-105 hover:shadow-2xl transition">Download HD</a>
          <button onClick={onRegenerate} className="px-8 py-3 rounded-xl border-2 border-indigo-600 text-indigo-700 font-bold bg-white/80 shadow-xl text-lg tracking-wide hover:bg-indigo-50 hover:scale-105 transition">Regenerate</button>
        </div>
      </div>
    </div>
  );
}
