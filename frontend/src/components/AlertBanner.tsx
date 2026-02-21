'use client';

import { useState, useEffect } from 'react';

interface Alert {
  id: string;
  type: string;
  message: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
}

export default function AlertBanner() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // TODO: Fetch active alerts from API
  // TODO: Set up WebSocket or polling for real-time updates

  useEffect(() => {
    // Example alerts (replace with API call)
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'Wildfire',
        message: 'Wildfire alert: Evacuate areas near Highway 101',
        severity: 'critical',
        timestamp: new Date().toISOString(),
      },
    ];
    setAlerts(mockAlerts);
  }, []);

  useEffect(() => {
    if (alerts.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % alerts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [alerts.length]);

  if (alerts.length === 0) return null;

  const currentAlert = alerts[currentIndex];
  const severityColors = {
    critical: 'bg-red-600',
    high: 'bg-orange-600',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  };

  return (
    <div className={`${severityColors[currentAlert.severity]} text-white p-4 rounded-lg shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="font-bold text-sm uppercase">{currentAlert.type}</p>
            <p className="text-lg">{currentAlert.message}</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30">
          View Details
        </button>
      </div>
      
      {alerts.length > 1 && (
        <div className="flex gap-1 mt-2 justify-center">
          {alerts.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 w-8 rounded ${idx === currentIndex ? 'bg-white' : 'bg-white bg-opacity-30'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
