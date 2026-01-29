"use client";
import { useState } from 'react';
import BrandForm from '@/components/poster-generator/BrandForm';
import ProcessingView from '@/components/poster-generator/ProcessingView';
import PosterShowcase from '@/components/poster-generator/PosterShowcase';
import AnimatedBlobs from '@/components/poster-generator/AnimatedBlobs';

type SuiteState = 'brief' | 'processing' | 'result';

export default function ProductionSuite() {
  const [state, setState] = useState<SuiteState>('brief');
  const [formData, setFormData] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Handlers for state transitions
  const handleBriefSubmit = (data: any) => {
    setFormData(data);
    setState('processing');
  };
  const handleProcessingComplete = (resultData: any) => {
    setResult(resultData);
    setState('result');
  };
  const handleRegenerate = () => {
    setState('brief');
    setError(null);
  };
  const handleHeaderClick = () => {
    setState('brief');
    setFormData(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="relative min-h-screen bg-[#f8fafc] overflow-hidden">
      <AnimatedBlobs />
      {/* Premium minimal header */}
      <header className="w-full z-10 sticky top-0 bg-transparent border-b border-white/40" style={{ WebkitBackdropFilter: 'blur(8px)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-center">
          <button
            className="uppercase tracking-[0.3em] text-2xl font-serif text-gray-900 bg-transparent border-none outline-none cursor-pointer select-none"
            style={{ fontFamily: 'Playfair Display, serif', letterSpacing: '0.3em' }}
            onClick={handleHeaderClick}
            tabIndex={0}
            aria-label="Go to Production Suite Home"
          >
            Production Suite
          </button>
        </div>
      </header>
      {/* Main content */}
      <main>
        {state === 'brief' && !formData && (
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            {/* Badge */}
            <div className="mb-6">
              <span className="inline-block px-4 py-1 rounded-full bg-blue-500/50 text-xs font-semibold text-white tracking-wide shadow-sm">hApItech Design Intelligence</span>
            </div>
            {/* Hero Heading */}
            <h1 className="text-8xl font-serif font-bold text-center mb-8 select-none" style={{ fontFamily: 'Playfair Display, serif' }}>
              <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">hApItech High-End AI</span>
            </h1>
            <p className="text-xl text-gray-700 mb-10 max-w-2xl text-center">Luxury-grade poster creation for premium brands. Cinematic, editorial, and always on-brand.</p>
            {/* CTAs */}
            <div className="flex gap-4">
              <button
                className="btn-premium px-8 py-4 rounded-xl text-lg font-bold shadow-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white transition transform hover:-translate-y-0.5 hover:scale-105 hover:shadow-2xl focus:outline-none"
                onClick={() => setFormData({})}
              >
                Initialize Brief
              </button>
              <button
                className="px-8 py-4 rounded-xl text-lg font-semibold border border-white/60 bg-white/30 backdrop-blur-lg text-gray-900 shadow hover:bg-white/50 transition"
                style={{ WebkitBackdropFilter: 'blur(20px)', backdropFilter: 'blur(20px)' }}
                // onClick: could route to a future Brand Intelligence tool
                disabled
              >
                Analyze Visuals
              </button>
            </div>
          </div>
        )}
        {state === 'brief' && formData && (
          <BrandForm onSubmit={handleBriefSubmit} error={error} />
        )}
        {state === 'processing' && formData && (
          <ProcessingView formData={formData} onComplete={handleProcessingComplete} onError={setError} />
        )}
        {state === 'result' && result && (
          <PosterShowcase result={result} onRegenerate={handleRegenerate} />
        )}
      </main>
    </div>
  );
}