interface CampaignMode {
  id: string;
  name: string;
  description: string;
  features: string[];
}

interface Step2CampaignModeProps {
  data: {
    campaignMode: string;
    festivalName: string;
  };
  updateData: (updates: Partial<Step2CampaignModeProps['data']>) => void;
}

const campaignModes: CampaignMode[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, corporate design perfect for B2B businesses and professional services',
    features: [
      'Minimal color palette',
      'Corporate typography',
      'Strong contrast',
      'Zero visual clutter',
      'Trust-building aesthetics'
    ]
  },
  {
    id: 'festival',
    name: 'Festival / Themed',
    description: 'Vibrant, celebratory design for events, holidays, and themed campaigns',
    features: [
      'Rich color schemes',
      'Cultural patterns',
      'Expressive typography',
      'Emotional warmth',
      'Decorative elements'
    ]
  }
];

export default function Step2CampaignMode({ data, updateData }: Step2CampaignModeProps) {
  const handleModeSelect = (modeId: string) => {
    updateData({ campaignMode: modeId });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Campaign Style</h2>
        <p className="text-gray-600">Choose the visual tone and personality for your poster</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaignModes.map((mode) => (
          <div
            key={mode.id}
            onClick={() => handleModeSelect(mode.id)}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${
              data.campaignMode === mode.id
                ? 'border-magenta bg-magenta/5'
                : 'border-gray-200 hover:border-magenta/50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-charcoal">{mode.name}</h3>
              <div className={`w-5 h-5 rounded-full border-2 ${
                data.campaignMode === mode.id
                  ? 'bg-magenta border-magenta'
                  : 'border-gray-300'
              }`}>
                {data.campaignMode === mode.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50" />
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-4">{mode.description}</p>

            <div className="space-y-2">
              <h4 className="font-medium text-charcoal">Features:</h4>
              <ul className="space-y-1">
                {mode.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-magenta rounded-full mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {data.campaignMode && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">
            <strong>Selected Style:</strong> {campaignModes.find(mode => mode.id === data.campaignMode)?.name}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            This will influence the color scheme, typography, and overall visual approach of your poster.
          </p>
        </div>
      )}

      {data.campaignMode === 'festival' && (
        <div className="mt-6">
          <label htmlFor="festivalName" className="block text-sm font-medium text-charcoal mb-2">
            Festival / Theme Name
          </label>
          <input
            type="text"
            id="festivalName"
            value={data.festivalName}
            onChange={(e) => updateData({ festivalName: e.target.value })}
            placeholder="e.g., Diwali, Christmas, Black Friday, Summer Sale"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-magenta focus:border-transparent"
          />
          <p className="text-sm text-gray-600 mt-2">
            This will help the AI incorporate culturally appropriate elements, colors, and festive themes into your poster design.
          </p>
        </div>
      )}
    </div>
  );
}