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

  return (
    <div className="relative min-h-screen bg-[#f8fafc] overflow-hidden">
      <AnimatedBlobs />
      {state === 'brief' && (
        <BrandForm onSubmit={handleBriefSubmit} error={error} />
      )}
      {state === 'processing' && formData && (
        <ProcessingView formData={formData} onComplete={handleProcessingComplete} onError={setError} />
      )}
      {state === 'result' && result && (
        <PosterShowcase result={result} onRegenerate={handleRegenerate} />
      )}
    </div>
  );
}