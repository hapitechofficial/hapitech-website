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

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            {stages.map((s, i) => (
              <div key={s} className={`w-6 h-6 rounded-full border-2 ${i <= stage ? 'bg-gray-900 border-gray-900' : 'bg-gray-200 border-gray-300'} transition-all`} />
            ))}
          </div>
          <div className="text-lg font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>{stages[stage]}</div>
        </div>
        <div className="h-12 flex items-center justify-center">
          {failed && <span className="text-red-600">An error occurred. Please try again.</span>}
        </div>
      </div>
    </div>
  );
}
