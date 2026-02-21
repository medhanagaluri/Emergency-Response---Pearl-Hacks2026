'use client';

import { useState } from 'react';

interface Incident {
  id: string;
  type: string;
  location: string;
  severity: string;
  status: string;
  reportedAt: string;
}

export default function AdminTable() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filter, setFilter] = useState('all');

  // TODO: Fetch incidents from API
  // TODO: Add pagination
  // TODO: Add search functionality
  // TODO: Add actions (approve, reject, update status)

  const handleStatusChange = async (id: string, newStatus: string) => {
    // TODO: Update status via API
    console.log(`Updating incident ${id} to status: ${newStatus}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b flex gap-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Incidents</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="resolved">Resolved</option>
        </select>
        
        <input
          type="text"
          placeholder="Search incidents..."
          className="flex-1 border rounded px-3 py-2"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reported</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {incidents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No incidents to display
                </td>
              </tr>
            ) : (
              incidents.map((incident) => (
                <tr key={incident.id}>
                  <td className="px-6 py-4 text-sm">{incident.id}</td>
                  <td className="px-6 py-4 text-sm">{incident.type}</td>
                  <td className="px-6 py-4 text-sm">{incident.location}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      incident.severity === 'critical' ? 'bg-red-100 text-red-800' : 
                      incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {incident.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{incident.status}</td>
                  <td className="px-6 py-4 text-sm">{incident.reportedAt}</td>
                  <td className="px-6 py-4 text-sm">
                    <button className="text-blue-600 hover:underline mr-2">View</button>
                    <button className="text-green-600 hover:underline mr-2">Verify</button>
                    <button className="text-red-600 hover:underline">Reject</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
