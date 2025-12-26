import React from 'react';
import type { SizeOption, PosterType } from '@/types/poster';
import FileInput from './FileInput';
import MultiFileInput from './MultiFileInput';
import { SparklesIcon, LinkIcon } from './icons';

interface InputFormProps {
  brandName: string;
  setBrandName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;

  contactPhone: string;
  setContactPhone: (value: string) => void;
  website: string;
  setWebsite: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;

  productImages: File[];
  setProductImages: (files: File[]) => void;
  productUrl: string;
  setProductUrl: (value: string) => void;
  brandLogo: File | null;
  setBrandLogo: (file: File | null) => void;

  posterType: PosterType;
  setPosterType: (type: PosterType) => void;
  festivalName: string;
  setFestivalName: (value: string) => void;

  isLoading: boolean;
  onSubmit: () => void;
  onUpdateText: () => void;
  hasGeneratedImage: boolean;
  onReset: () => void;
  selectedSize: SizeOption | null;
  onChangeSize: () => void;
}

const InputForm: React.FC<InputFormProps> = ({
  brandName, setBrandName, description, setDescription,
  contactPhone, setContactPhone, website, setWebsite, address, setAddress,
  productImages, setProductImages, productUrl, setProductUrl, brandLogo, setBrandLogo,
  posterType, setPosterType, festivalName, setFestivalName,
  isLoading, onSubmit, onUpdateText, hasGeneratedImage, onReset, selectedSize, onChangeSize
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg space-y-6 animate-fade-in">

      {/* Selected Size Header */}
      {selectedSize && (
        <div className="flex items-center justify-between bg-indigo-900/30 border border-indigo-500/30 p-3 rounded-lg mb-2">
            <div>
                <span className="text-xs text-indigo-300 uppercase font-bold tracking-wider block">Selected Format</span>
                <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{selectedSize.title}</span>
                    <span className="text-xs text-gray-400 bg-gray-900 px-2 py-0.5 rounded-full">{selectedSize.dimensions}</span>
                </div>
            </div>
            <button
                onClick={onChangeSize}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md transition"
            >
                Change
            </button>
        </div>
      )}

      {/* Campaign Mode Switch */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Campaign Mode</label>
        <div className="bg-gray-900/50 p-1 rounded-lg flex">
            <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${posterType === 'Professional' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            onClick={() => setPosterType('Professional')}
            >
            Professional
            </button>
            <button
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${posterType === 'Festival' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
            onClick={() => setPosterType('Festival')}
            >
            Festival / Themed
            </button>
        </div>
      </div>

      {posterType === 'Festival' && (
        <div className="space-y-2 animate-fade-in">
             <label htmlFor="festivalName" className="block text-sm font-medium text-indigo-300">Festival / Occasion Name</label>
             <input
                type="text"
                id="festivalName"
                value={festivalName}
                onChange={(e) => setFestivalName(e.target.value)}
                placeholder="e.g., Diwali, Christmas, Black Friday Sale"
                className="w-full bg-gray-900/50 border border-indigo-500/50 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
             />
        </div>
      )}

      {/* Brand Details */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-white border-b border-gray-700 pb-2">1. Brand & Product Details</h3>

        <div className="space-y-2">
            <label htmlFor="brandName" className="block text-sm font-medium text-gray-300">Brand Name</label>
            <input
            type="text"
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            placeholder="e.g., Aura Cosmetics"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
        </div>

        <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description / Key Features</label>
            <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe the product features, benefits, or tagline."
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
        </div>
      </div>

      {/* Contact Details (Optional) */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-white border-b border-gray-700 pb-2">
            2. Contact Details <span className="text-xs font-normal text-gray-400 ml-1">(Optional)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-300">Phone Number</label>
                <input
                type="text"
                id="contactPhone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="website" className="block text-sm font-medium text-gray-300">Website</label>
                <input
                type="text"
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="www.example.com"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
        </div>
        <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-300">Address / Location</label>
            <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Market St, City"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
        </div>
      </div>

      {/* Product Source */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-white border-b border-gray-700 pb-2">3. Product Source <span className="text-xs font-normal text-gray-400 ml-1">(Provide at least one)</span></h3>

        {/* URL Input */}
        <div className="space-y-2">
            <label htmlFor="productUrl" className="block text-sm font-medium text-gray-300">Product Page URL <span className="text-gray-500 text-xs">(Optional)</span></label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <LinkIcon />
                </div>
                <input
                type="url"
                id="productUrl"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                placeholder="https://myshop.com/product"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg pl-10 pr-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
            </div>
            <p className="text-xs text-gray-500">We'll use this to better understand your product details.</p>
        </div>

        {/* Multi-Image Upload */}
        <MultiFileInput
            label="Product Photos (Optional)"
            files={productImages}
            setFiles={setProductImages}
            maxFiles={6}
        />
      </div>

      {/* Assets */}
      <div className="space-y-4">
        <h3 className="text-md font-semibold text-white border-b border-gray-700 pb-2">4. Brand Assets</h3>

        <FileInput label="Brand Logo (Optional)" file={brandLogo} setFile={setBrandLogo} />
      </div>

      <div className="flex flex-col gap-4 pt-4">
         {hasGeneratedImage ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <button
                    onClick={onUpdateText}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-indigo-800 disabled:cursor-not-allowed disabled:scale-100"
                    >
                    {isLoading ? 'Updating...' : 'Update Text & Keep Layout'}
                 </button>
                 <button
                    onClick={onSubmit}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition disabled:cursor-not-allowed"
                    >
                    New Generation
                 </button>
             </div>
         ) : (
            <button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-indigo-800 disabled:cursor-not-allowed disabled:scale-100"
            >
            {isLoading ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
                </>
            ) : (
                <>
                <SparklesIcon />
                Generate Poster
                </>
            )}
            </button>
         )}

        <button
          onClick={onReset}
          disabled={isLoading}
          className="w-full bg-gray-800 hover:bg-gray-700 text-gray-400 font-medium py-2 px-4 rounded-lg transition text-sm"
        >
          Reset All Inputs
        </button>
      </div>
    </div>
  );
};

export default InputForm;