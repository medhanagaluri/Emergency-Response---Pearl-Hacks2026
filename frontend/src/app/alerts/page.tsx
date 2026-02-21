import AlertBanner from '@/components/AlertBanner';
import ResourceCard from '@/components/ResourceCard';

export default function AlertsPage() {
  // TODO: Fetch alerts from API
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Emergency Alerts</h1>
      
      {/* Active alerts banner */}
      <div className="mb-6">
        <AlertBanner />
      </div>

      {/* Alerts feed */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent Alerts</h2>
        {/* TODO: Map through alerts */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600">No active alerts at this time.</p>
        </div>
      </div>

      {/* Safety resources */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Safety Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ResourceCard />
        </div>
      </div>
    </div>
  );
}
