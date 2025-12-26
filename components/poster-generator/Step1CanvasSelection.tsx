interface CanvasOption {
  id: string;
  name: string;
  dimensions: string;
  width: number;
  height: number;
  description: string;
  platform: string;
}

interface Step1CanvasSelectionProps {
  data: {
    canvas: string;
  };
  updateData: (updates: Partial<Step1CanvasSelectionProps['data']>) => void;
}

const canvasOptions: CanvasOption[] = [
  {
    id: 'instagram-post',
    name: 'Instagram Post',
    dimensions: '1080×1080',
    width: 1080,
    height: 1080,
    description: 'Square format perfect for Instagram feed posts',
    platform: 'Instagram'
  },
  {
    id: 'instagram-story',
    name: 'Instagram Story',
    dimensions: '1080×1920',
    width: 1080,
    height: 1920,
    description: 'Vertical format for Instagram Stories',
    platform: 'Instagram'
  },
  {
    id: 'instagram-ad',
    name: 'Instagram Ad',
    dimensions: '4:5',
    width: 1080,
    height: 1350,
    description: 'Vertical ad format for Instagram Ads',
    platform: 'Instagram'
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    dimensions: '1280×720',
    width: 1280,
    height: 720,
    description: 'Horizontal thumbnail for YouTube videos',
    platform: 'YouTube'
  },
  {
    id: 'facebook-post',
    name: 'Facebook Poster',
    dimensions: '1200×1500',
    width: 1200,
    height: 1500,
    description: 'Vertical format for Facebook feed posts',
    platform: 'Facebook'
  },
  {
    id: 'linkedin-post',
    name: 'LinkedIn Post',
    dimensions: '1200×1200',
    width: 1200,
    height: 1200,
    description: 'Square format for LinkedIn professional posts',
    platform: 'LinkedIn'
  },
  {
    id: 'poster-portrait',
    name: 'Poster (Portrait)',
    dimensions: '18×24 in',
    width: 1536,
    height: 2048,
    description: 'Large portrait poster for print',
    platform: 'Print'
  },
  {
    id: 'phone-wallpaper',
    name: 'Phone Wallpaper',
    dimensions: '1080×2400',
    width: 1080,
    height: 2400,
    description: 'Tall format for mobile wallpapers',
    platform: 'Mobile'
  },
  {
    id: 'book-cover',
    name: 'Book Cover',
    dimensions: '1200×1800',
    width: 1200,
    height: 1800,
    description: 'Vertical format for book covers',
    platform: 'Print'
  },
  {
    id: 'magazine-cover',
    name: 'Magazine Cover',
    dimensions: '1200×1600',
    width: 1200,
    height: 1600,
    description: 'Magazine cover format',
    platform: 'Print'
  }
];

export default function Step1CanvasSelection({ data, updateData }: Step1CanvasSelectionProps) {
  const handleCanvasSelect = (option: CanvasOption) => {
    updateData({
      canvas: option.id,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Choose Your Canvas</h2>
        <p className="text-gray-600">Select the format and platform for your poster</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {canvasOptions.map((option) => (
          <div
            key={option.id}
            onClick={() => handleCanvasSelect(option)}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              data.canvas === option.id
                ? 'border-magenta bg-magenta/5'
                : 'border-gray-200 hover:border-magenta/50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-charcoal">{option.name}</h3>
              <div className={`w-4 h-4 rounded-full border-2 ${
                data.canvas === option.id
                  ? 'bg-magenta border-magenta'
                  : 'border-gray-300'
              }`}>
                {data.canvas === option.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50" />
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">{option.dimensions}</p>
            <p className="text-sm text-gray-500">{option.description}</p>
            <span className="inline-block mt-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              {option.platform}
            </span>
          </div>
        ))}
      </div>

      {data.canvas && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            <strong>Selected:</strong> {canvasOptions.find(opt => opt.id === data.canvas)?.name}
          </p>
        </div>
      )}
    </div>
  );
}