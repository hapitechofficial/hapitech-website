interface Step3BrandDetailsProps {
  data: {
    brandName: string;
    description: string;
    tagline: string;
  };
  updateData: (updates: Partial<Step3BrandDetailsProps['data']>) => void;
}

export default function Step3BrandDetails({ data, updateData }: Step3BrandDetailsProps) {
  const handleChange = (field: keyof Step3BrandDetailsProps['data']) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    updateData({ [field]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Brand & Product Details</h2>
        <p className="text-gray-600">Tell us about your brand and what makes it special</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="brandName" className="block text-sm font-medium text-charcoal mb-2">
            Brand Name *
          </label>
          <input
            type="text"
            id="brandName"
            value={data.brandName}
            onChange={handleChange('brandName')}
            placeholder="e.g., TechCorp Solutions"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            This will be the primary visual anchor of your poster
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-charcoal mb-2">
            Description / Features / Tagline *
          </label>
          <textarea
            id="description"
            value={data.description}
            onChange={handleChange('description')}
            placeholder="Describe your product/service, key features, and what makes it unique..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent resize-none"
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            This will be converted into compelling copy that highlights your value proposition
          </p>
        </div>

        <div>
          <label htmlFor="tagline" className="block text-sm font-medium text-charcoal mb-2">
            Tagline (Optional)
          </label>
          <input
            type="text"
            id="tagline"
            value={data.tagline}
            onChange={handleChange('tagline')}
            placeholder="e.g., 'Innovation at Your Fingertips'"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            A short, memorable phrase that captures your brand essence
          </p>
        </div>
      </div>

      {/* Preview of how the text will be structured */}
      {(data.brandName || data.description || data.tagline) && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-charcoal mb-3">Text Preview:</h4>
          <div className="space-y-2 text-sm">
            {data.brandName && (
              <div>
                <span className="font-bold text-lg text-magenta">{data.brandName}</span>
              </div>
            )}
            {data.tagline && (
              <div className="italic text-gray-700">"{data.tagline}"</div>
            )}
            {data.description && (
              <div className="text-gray-600 leading-relaxed">
                {data.description.length > 100
                  ? `${data.description.substring(0, 100)}...`
                  : data.description
                }
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * AI will optimize this content for visual hierarchy and readability
          </p>
        </div>
      )}
    </div>
  );
}