interface PosterPreviewProps {
  formData: {
    canvas: string;
    campaignMode: string;
    festivalName: string;
    brandName: string;
    description: string;
    tagline: string;
    phone: string;
    website: string;
    address: string;
    productUrl: string;
    productImages: File[];
    brandLogo: File | null;
    generatedPosterUrl?: string;
  };
}

export default function PosterPreview({ formData }: PosterPreviewProps) {
  // Get canvas dimensions based on selection
  const getCanvasDimensions = (canvas: string) => {
    const dimensions = {
      'instagram-square': { width: 400, height: 400 },
      'instagram-story': { width: 300, height: 533 },
      'instagram-post': { width: 400, height: 500 },
      'facebook-post': { width: 400, height: 400 },
      'facebook-story': { width: 300, height: 533 },
      'youtube-thumbnail': { width: 400, height: 225 },
      'linkedin-post': { width: 400, height: 400 },
      'twitter-post': { width: 400, height: 300 },
      'pinterest-pin': { width: 300, height: 450 },
      'custom-banner': { width: 400, height: 200 },
    };
    return dimensions[canvas as keyof typeof dimensions] || { width: 400, height: 400 };
  };

  const dimensions = getCanvasDimensions(formData.canvas);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
      <h3 className="text-lg font-semibold text-charcoal mb-4">Poster Preview</h3>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div
          className="bg-white border border-gray-300 rounded-lg overflow-hidden mx-auto shadow-lg"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            maxWidth: '100%',
            aspectRatio: `${dimensions.width}/${dimensions.height}`
          }}
        >
          {/* Show generated poster if available */}
          {formData.generatedPosterUrl ? (
            <img
              src={formData.generatedPosterUrl}
              alt="Generated Poster"
              className="w-full h-full object-cover"
            />
          ) : (
            /* Poster Content Preview */
            <div className="w-full h-full flex flex-col relative">
            {/* Background gradient based on campaign mode */}
            <div className={`absolute inset-0 ${
              formData.campaignMode === 'professional'
                ? 'bg-gradient-to-br from-teal via-magenta to-orange'
                : 'bg-gradient-to-br from-magenta via-orange to-teal'
            } opacity-10`} />

            {/* Brand Logo */}
            {formData.brandLogo && (
              <div className="absolute top-4 left-4 w-12 h-12 bg-white/80 rounded-lg p-1">
                <img
                  src={URL.createObjectURL(formData.brandLogo)}
                  alt="Brand Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 text-center relative z-10">
              {/* Brand Name */}
              {formData.brandName && (
                <h1 className="text-2xl md:text-3xl font-bold text-charcoal mb-2">
                  {formData.brandName}
                </h1>
              )}

              {/* Tagline */}
              {formData.tagline && (
                <p className="text-lg italic text-magenta mb-4">
                  "{formData.tagline}"
                </p>
              )}

              {/* Description */}
              {formData.description && (
                <p className="text-sm text-gray-700 mb-6 leading-relaxed max-w-xs">
                  {formData.description.length > 100
                    ? `${formData.description.substring(0, 100)}...`
                    : formData.description
                  }
                </p>
              )}

              {/* Product Images Preview */}
              {formData.productImages.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {formData.productImages.slice(0, 3).map((_, index) => (
                    <div key={index} className="w-8 h-8 bg-gray-200 rounded border-2 border-white shadow-sm">
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 rounded-sm" />
                    </div>
                  ))}
                  {formData.productImages.length > 3 && (
                    <div className="w-8 h-8 bg-gray-200 rounded border-2 border-white shadow-sm flex items-center justify-center">
                      <span className="text-xs text-gray-600">+{formData.productImages.length - 3}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Contact Information */}
            {(formData.phone || formData.website || formData.address) && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
                  <div className="flex flex-wrap gap-2 text-gray-600">
                    {formData.phone && <span>📞 {formData.phone}</span>}
                    {formData.website && (
                      <span>🌐 {formData.website.replace(/^https?:\/\//, '')}</span>
                    )}
                    {formData.address && <span>📍 {formData.address.split(',')[0]}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Campaign Mode Badge */}
            <div className="absolute top-4 right-4">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                formData.campaignMode === 'professional'
                  ? 'bg-teal text-white'
                  : 'bg-orange text-white'
              }`}>
                {formData.campaignMode === 'professional' ? 'Professional' : 'Festival'}
              </span>
            </div>
          </div>
          )}
        </div>

        {/* Preview Notes */}
        <div className="mt-4 text-xs text-gray-500 space-y-1">
          {formData.generatedPosterUrl ? (
            <>
              <p>• Your AI-generated poster is ready for download!</p>
              <p>• High-resolution image perfect for printing and digital use.</p>
              <p>• You can update text or create a new generation.</p>
            </>
          ) : (
            <>
              <p>• This is a simplified preview. The actual AI-generated poster will be more polished.</p>
              <p>• Colors, fonts, and layout will be optimized for maximum visual impact.</p>
              <p>• High-resolution output suitable for printing and digital use.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}