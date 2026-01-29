"use client";
import React, { useState } from 'react';

interface BrandFormProps {
  onSubmit: (data: any) => void;
  error: string | null;
}

const industries = [
  'Tech', 'Luxury', 'Fashion', 'FMCG', 'Automotive', 'Hospitality', 'Other'
];

export default function BrandForm({ onSubmit, error }: BrandFormProps) {
  const [productImage, setProductImage] = useState<File | null>(null);
  const [brandLogo, setBrandLogo] = useState<File | null>(null);
  const [industry, setIndustry] = useState('Tech');
  const [description, setDescription] = useState('');
  const [headline, setHeadline] = useState('');
  const [tagline, setTagline] = useState('');
  const [touched, setTouched] = useState(false);

  const isValid = !!productImage && description.trim() && headline.trim() && tagline.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onSubmit({ productImage, brandLogo, industry, description, headline, tagline });
  };

  return (
    <form className="max-w-xl mx-auto mt-16 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-200" onSubmit={handleSubmit}>
      <h1 className="text-3xl font-serif font-bold mb-6 text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>Creative Brief</h1>
      <div className="mb-4">
        <label className="block font-medium mb-1">Product Image <span className="text-red-500">*</span></label>
        <input type="file" accept="image/*" required className="block w-full" onChange={e => setProductImage(e.target.files?.[0] || null)} />
        {touched && !productImage && <p className="text-red-500 text-xs mt-1">Product image is required.</p>}
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Brand Logo (optional)</label>
        <input type="file" accept="image/*" className="block w-full" onChange={e => setBrandLogo(e.target.files?.[0] || null)} />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Brand Industry</label>
        <select className="block w-full rounded border-gray-300" value={industry} onChange={e => setIndustry(e.target.value)}>
          {industries.map(ind => <option key={ind}>{ind}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Product Description <span className="text-red-500">*</span></label>
        <textarea className="block w-full rounded border-gray-300" value={description} onChange={e => setDescription(e.target.value)} required rows={3} />
        {touched && !description.trim() && <p className="text-red-500 text-xs mt-1">Description is required.</p>}
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Exact Headline <span className="text-red-500">*</span></label>
        <input className="block w-full rounded border-gray-300" value={headline} onChange={e => setHeadline(e.target.value)} required />
        {touched && !headline.trim() && <p className="text-red-500 text-xs mt-1">Headline is required.</p>}
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">Exact Tagline <span className="text-red-500">*</span></label>
        <input className="block w-full rounded border-gray-300" value={tagline} onChange={e => setTagline(e.target.value)} required />
        {touched && !tagline.trim() && <p className="text-red-500 text-xs mt-1">Tagline is required.</p>}
      </div>
      {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
      <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-gray-900 text-white font-semibold shadow transition disabled:opacity-50" disabled={!isValid}>Continue</button>
    </form>
  );
}
