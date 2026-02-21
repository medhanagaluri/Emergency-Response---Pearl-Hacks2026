import { notFound } from 'next/navigation';

interface IncidentDetailProps {
  params: {
    id: string;
  };
}

export default async function IncidentDetailPage({ params }: IncidentDetailProps) {
  const { id } = params;
  
  // TODO: Fetch incident data from API
  // const incident = await fetchIncident(id);
  // if (!incident) return notFound();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Incident Details</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Incident ID: {id}</p>
        {/* TODO: Display incident details */}
        {/* - Location, type, severity */}
        {/* - Description */}
        {/* - Media attachments */}
        {/* - Status updates */}
        {/* - Safety resources (Person D) */}
      </div>
    </div>
  );
}
