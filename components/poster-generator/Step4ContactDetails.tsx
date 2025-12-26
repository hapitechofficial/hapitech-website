interface Step4ContactDetailsProps {
  data: {
    phone: string;
    website: string;
    address: string;
  };
  updateData: (updates: Partial<Step4ContactDetailsProps['data']>) => void;
}

export default function Step4ContactDetails({ data, updateData }: Step4ContactDetailsProps) {
  const handleChange = (field: keyof Step4ContactDetailsProps['data']) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    updateData({ [field]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Contact Information</h2>
        <p className="text-gray-600">Add your contact details to make it easy for customers to reach you</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-charcoal mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            id="phone"
            value={data.phone}
            onChange={handleChange('phone')}
            placeholder="e.g., +91 98765 43210"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Include country code for international visibility
          </p>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-charcoal mb-2">
            Website URL (Optional)
          </label>
          <input
            type="url"
            id="website"
            value={data.website}
            onChange={handleChange('website')}
            placeholder="e.g., https://www.yourbrand.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            Your website will be displayed as a clickable link
          </p>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-charcoal mb-2">
            Address (Optional)
          </label>
          <textarea
            id="address"
            value={data.address}
            onChange={handleChange('address')}
            placeholder="Street address, city, state, pincode..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            Physical location for local customers
          </p>
        </div>
      </div>

      {/* Contact info preview */}
      {(data.phone || data.website || data.address) && (
        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-charcoal mb-3">Contact Preview:</h4>
          <div className="space-y-2 text-sm">
            {data.phone && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📞</span>
                <span>{data.phone}</span>
              </div>
            )}
            {data.website && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">🌐</span>
                <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-magenta hover:underline">
                  {data.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}
            {data.address && (
              <div className="flex items-center gap-2">
                <span className="text-gray-500">📍</span>
                <span className="text-gray-600">{data.address}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            * Contact information will be positioned strategically on your poster
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-500 text-lg">ℹ️</span>
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Privacy Note</h4>
            <p className="text-sm text-blue-700">
              Contact details are optional. You can always update them later in your account settings.
              Only include information you're comfortable sharing publicly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}