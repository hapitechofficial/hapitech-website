'use client';

import { useState, useRef } from 'react';

interface Step6BrandAssetsProps {
  data: {
    brandLogo: File | null;
  };
  updateData: (updates: Partial<Step6BrandAssetsProps['data']>) => void;
}

export default function Step6BrandAssets({ data, updateData }: Step6BrandAssetsProps) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      updateData({ brandLogo: file });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeLogo = () => {
    updateData({ brandLogo: null });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Brand Assets</h2>
        <p className="text-gray-600">Upload your brand logo to maintain visual consistency</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Brand Logo (Optional)
          </label>

          {/* Upload Area */}
          {!data.brandLogo ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-magenta bg-magenta/5'
                  : 'border-gray-300 hover:border-magenta/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-4">
                <div className="text-4xl">🎨</div>
                <div>
                  <p className="text-lg font-medium text-charcoal">
                    Drop your brand logo here
                  </p>
                  <p className="text-gray-500 mt-1">
                    or{' '}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-magenta hover:underline font-medium"
                    >
                      browse file
                    </button>
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  <p>Supported formats: PNG, JPG, SVG (transparent background recommended)</p>
                  <p>Maximum file size: 2MB</p>
                  <p>Recommended: Square or horizontal logo</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          ) : (
            /* Logo Preview */
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-charcoal">Logo Preview:</h4>
                <button
                  type="button"
                  onClick={removeLogo}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={URL.createObjectURL(data.brandLogo)}
                    alt="Brand Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-charcoal">{data.brandLogo.name}</p>
                  <p className="text-sm text-gray-500">
                    {(data.brandLogo.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    The AI will automatically position and scale your logo for optimal visual impact
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-500 text-lg">ℹ️</span>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Logo Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Use a high-resolution logo (at least 500x500px)</li>
              <li>• PNG format with transparent background works best</li>
              <li>• Avoid logos with fine details that might not display well at small sizes</li>
              <li>• If you don't have a logo, the AI will create a text-based brand representation</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-green-500 text-lg">✅</span>
          <div>
            <h4 className="font-medium text-green-900 mb-1">Ready to Generate!</h4>
            <p className="text-sm text-green-700">
              You've completed all the steps. Click "Generate Poster" to create your professional poster
              using AI. The process typically takes 30-60 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}