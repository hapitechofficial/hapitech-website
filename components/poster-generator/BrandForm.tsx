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
  const [language, setLanguage] = useState('English');
  const [touched, setTouched] = useState(false);

  const isValid = !!productImage && description.trim() && headline.trim() && tagline.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    onSubmit({ productImage, brandLogo, industry, description, headline, tagline, language });
  };

  return (
    <form className="max-w-2xl mx-auto mt-16 glass rounded-3xl shadow-2xl p-10 border border-white/30" style={{backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}} onSubmit={handleSubmit}>
      <h1 className="text-4xl font-serif font-bold mb-8 text-gray-900 tracking-tight text-center" style={{ fontFamily: 'Playfair Display, serif' }}>Production Brief</h1>
      {/* Uploads */}
      <div className="flex gap-6 mb-8">
        {/* Product Image */}
        <div className="flex-1 flex flex-col items-center">
          <label className="block text-sm font-medium mb-2 text-gray-700">Product Photography <span className="text-red-500">*</span></label>
          <label className={`w-full h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition bg-white/40 hover:bg-white/60 ${touched && !productImage ? 'border-red-400' : 'border-gray-300'}`}> 
            {productImage ? (
              <img src={URL.createObjectURL(productImage)} alt="Product" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <span className="text-gray-400 text-lg">Click to upload</span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={e => setProductImage(e.target.files?.[0] || null)} />
          </label>
          {touched && !productImage && <p className="text-red-500 text-xs mt-1">Product image is required.</p>}
        </div>
        {/* Brand Logo */}
        <div className="flex-1 flex flex-col items-center">
          <label className="block text-sm font-medium mb-2 text-gray-700">Brand Logo (optional)</label>
          <label className="w-full h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition bg-white/40 hover:bg-white/60 border-gray-300">
            {brandLogo ? (
              <img src={URL.createObjectURL(brandLogo)} alt="Brand Logo" className="w-24 h-24 object-contain rounded-lg" />
            ) : (
              <span className="text-gray-400 text-lg">Click to upload</span>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={e => setBrandLogo(e.target.files?.[0] || null)} />
          </label>
        </div>
      </div>
      {/* Industry & Description */}
      <div className="mb-6">
        <label className="block font-medium mb-1 text-gray-700">Brand Industry</label>
        <select className="block w-full rounded border-gray-300 font-sans" value={industry} onChange={e => setIndustry(e.target.value)}>
          {industries.map(ind => <option key={ind}>{ind}</option>)}
        </select>
      </div>
      <div className="mb-6">
        <label className="block font-medium mb-1 text-gray-700">Product Description <span className="text-red-500">*</span></label>
        <textarea className="block w-full rounded border-gray-300 font-sans" value={description} onChange={e => setDescription(e.target.value)} required rows={3} />
        {touched && !description.trim() && <p className="text-red-500 text-xs mt-1">Description is required.</p>}
      </div>
      {/* Copy Preservation */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-medium mb-1 text-gray-700">Exact Headline <span className="text-red-500">*</span></label>
          <input className="block w-full rounded border-gray-300 font-serif text-lg" style={{ fontFamily: 'Playfair Display, serif' }} value={headline} onChange={e => setHeadline(e.target.value)} required />
          {touched && !headline.trim() && <p className="text-red-500 text-xs mt-1">Headline is required.</p>}
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-700">Exact Tagline <span className="text-red-500">*</span></label>
          <input className="block w-full rounded border-gray-300 font-serif text-lg" style={{ fontFamily: 'Playfair Display, serif' }} value={tagline} onChange={e => setTagline(e.target.value)} required />
          {touched && !tagline.trim() && <p className="text-red-500 text-xs mt-1">Tagline is required.</p>}
        </div>
      </div>
      {/* Language Protocol */}
      <div className="mb-8">
        <label className="block font-medium mb-1 text-gray-700">Language Protocol <span className="text-gray-400">(e.g. English, Hindi, Gujarati, Arabic)</span></label>
        <input className="block w-full rounded border-gray-300 font-sans" value={language} onChange={e => setLanguage(e.target.value)} placeholder="English" />
      </div>
      {error && <div className="text-red-600 mb-2 text-sm text-center">{error}</div>}
      <button type="submit" className="w-full py-4 mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold shadow-xl text-lg tracking-wide transition disabled:opacity-50" disabled={!isValid}>Continue</button>
    </form>
  );
}
