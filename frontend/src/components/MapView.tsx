'use client';

import { useState } from 'react';
import ReportModal from './ReportModal';

export default function MapView() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  // TODO: Integrate map library (e.g., Mapbox, Leaflet, Google Maps)
  // TODO: Fetch incidents from API
  // TODO: Add map pins for incidents
  // TODO: Add filters (type, severity, date range)

  return (
    <div className="relative h-full w-full">
      {/* Map container */}
      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
        <p className="text-gray-600">Map will render here (integrate Mapbox/Leaflet)</p>
      </div>

      {/* Filters */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-4 space-y-2">
        <h3 className="font-semibold">Filters</h3>
        <div>
          <label className="block text-sm">Incident Type</label>
          <select className="border rounded px-2 py-1 text-sm">
            <option>All</option>
            <option>Fire</option>
            <option>Flood</option>
            <option>Earthquake</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm">Severity</label>
          <select className="border rounded px-2 py-1 text-sm">
            <option>All</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      {/* Report incident button */}
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="absolute bottom-8 right-8 bg-red-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-700 transition"
      >
        Report Incident
      </button>

      {/* Report modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}
