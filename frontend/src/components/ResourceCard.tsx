'use client';

interface ResourceCardProps {
  title?: string;
  description?: string;
  steps?: string[];
  type?: 'fire' | 'flood' | 'earthquake' | 'general';
}

export default function ResourceCard({
  title = 'Safety Tips',
  description = 'Important safety information',
  steps = ['Stay calm', 'Follow emergency procedures', 'Contact authorities'],
  type = 'general',
}: ResourceCardProps) {
  const iconColor = {
    fire: 'bg-red-100 text-red-600',
    flood: 'bg-blue-100 text-blue-600',
    earthquake: 'bg-yellow-100 text-yellow-600',
    general: 'bg-gray-100 text-gray-600',
  }[type];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className={`w-12 h-12 rounded-full ${iconColor} flex items-center justify-center mb-4`}>
        <span className="text-2xl">ℹ️</span>
      </div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      
      <div className="space-y-2">
        <h4 className="font-medium text-sm">Safety Steps:</h4>
        <ul className="list-disc list-inside space-y-1">
          {steps.map((step, index) => (
            <li key={index} className="text-sm text-gray-700">
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* TODO: Add links to external resources */}
      {/* TODO: Add download option for offline access */}
    </div>
  );
}
