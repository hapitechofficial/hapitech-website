'use client';

import { useState, useRef } from 'react';

interface Step5ProductAssetsProps {
  data: {
    productUrl: string;
    productImages: File[];
  };
  updateData: (updates: Partial<Step5ProductAssetsProps['data']>) => void;
}

export default function Step5ProductAssets({ data, updateData }: Step5ProductAssetsProps) {
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
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFiles = async (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    const validFiles = imageFiles.slice(0, 6 - data.productImages.length);

    if (validFiles.length > 0) {
      // Convert files to base64
      const filesWithBase64 = await Promise.all(
        validFiles.map(async (file) => {
          const base64 = await fileToBase64(file);
          return {
            file,
            base64,
            name: file.name,
          };
        })
      );

      updateData({ productImages: [...data.productImages, ...filesWithBase64.map(item => item.file)] });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeImage = (index: number) => {
    const newImages = data.productImages.filter((_, i) => i !== index);
    updateData({ productImages: newImages });
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ productUrl: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Product Assets</h2>
        <p className="text-gray-600">Upload product images and provide a product link</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="productUrl" className="block text-sm font-medium text-charcoal mb-2">
            Product URL (Optional)
          </label>
          <input
            type="url"
            id="productUrl"
            value={data.productUrl}
            onChange={handleUrlChange}
            placeholder="e.g., https://yourstore.com/product-link"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Link to your product page for easy access
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Product Images ({data.productImages.length}/6)
          </label>

          {/* Upload Area */}
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
              <div className="text-4xl">📸</div>
              <div>
                <p className="text-lg font-medium text-charcoal">
                  Drop your product images here
                </p>
                <p className="text-gray-500 mt-1">
                  or{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-magenta hover:underline font-medium"
                  >
                    browse files
                  </button>
                </p>
              </div>
              <div className="text-sm text-gray-500">
                <p>Supported formats: JPG, PNG, WebP</p>
                <p>Maximum 6 images, up to 5MB each</p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Image Preview Grid */}
          {data.productImages.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-charcoal mb-3">Uploaded Images:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.productImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Product ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-green-500 text-lg">💡</span>
          <div>
            <h4 className="font-medium text-green-900 mb-1">Pro Tip</h4>
            <p className="text-sm text-green-700">
              Upload high-quality images showing your product from multiple angles.
              The AI will automatically select and arrange the best images for maximum visual impact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}