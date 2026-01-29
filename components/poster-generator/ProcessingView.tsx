"use client";
import React, { useEffect, useState } from 'react';

interface ProcessingViewProps {
  formData: any;
  onComplete: (result: any) => void;
  onError: (msg: string) => void;
}

const stages = [
  'Analyzing Brand Strategy',
  'Applying Studio Lighting',
  'Designing Cinematic Composition',
  'Finalizing Compositing'
];

export default function ProcessingView({ formData, onComplete, onError }: ProcessingViewProps) {
  const [stage, setStage] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const runStages = async () => {
      for (let i = 0; i < stages.length; i++) {
        setStage(i);
        await new Promise(res => setTimeout(res, 1200));
      }
      // Call API
      try {
        const body = new FormData();
        body.append('productImage', formData.productImage);
        if (formData.brandLogo) body.append('brandLogo', formData.brandLogo);
        body.append('industry', formData.industry);
        body.append('description', formData.description);
        body.append('headline', formData.headline);
        body.append('tagline', formData.tagline);
        if (formData.language) body.append('language', formData.language);
        const res = await fetch('/api/poster/generate', { method: 'POST', body });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        if (!cancelled) onComplete(data);
      } catch (e: any) {
        setFailed(true);
        onError('Failed to generate poster. Please try again.');
      }
    };
    runStages();
    return () => { cancelled = true; };
  }, []);

  // Mesh gradient background overlay
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
      <div className="w-full max-w-xl glass rounded-3xl shadow-2xl p-10 border border-white/30" style={{backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}}>
        <h2 className="text-2xl font-serif font-bold mb-8 text-gray-900 tracking-tight text-center" style={{ fontFamily: 'Playfair Display, serif' }}>Crafting Your Editorial Poster</h2>
        <div className="mb-8 flex flex-col items-center">
          {/* Animated progress bar with luxury dots */}
          <div className="flex items-center gap-4 mb-4">
            {stages.map((s, i) => (
              <div key={s} className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${i < stage ? 'bg-gradient-to-br from-indigo-500 via-purple-400 to-pink-300 border-indigo-500 shadow-lg' : i === stage ? 'bg-white border-indigo-400 shadow-md' : 'bg-white/40 border-gray-300'}`}>
                <span className={`block w-2 h-2 rounded-full ${i <= stage ? 'bg-indigo-700' : 'bg-gray-300'}`}></span>
              </div>
            ))}
          </div>
          <div className="text-lg font-semibold text-gray-900 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>{stages[stage]}</div>
        </div>
        <div className="h-14 flex items-center justify-center">
          {failed && (
            <span className="text-red-600 text-base font-semibold bg-white/70 px-4 py-2 rounded-xl shadow border border-red-200 animate-pulse">An error occurred. Please try again.</span>
          )}
        </div>
      </div>
    </div>
  );
}
