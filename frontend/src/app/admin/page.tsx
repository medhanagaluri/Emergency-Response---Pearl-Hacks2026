import AdminTable from '@/components/AdminTable';

export default function AdminPage() {
  // TODO: Add authentication check
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Incidents</h3>
          <p className="text-3xl font-bold">-</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Active Alerts</h3>
          <p className="text-3xl font-bold">-</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Pending Review</h3>
          <p className="text-3xl font-bold">-</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600">Resolved Today</h3>
          <p className="text-3xl font-bold">-</p>
        </div>
      </div>

      {/* Admin table */}
      <AdminTable />
    </div>
  );
}
