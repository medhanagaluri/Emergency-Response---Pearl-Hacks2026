// API base URL - configure in .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Incidents API
export const incidentsAPI = {
  getAll: (filters?: { type?: string; severity?: string }) => {
    const params = new URLSearchParams(filters as any);
    return fetchAPI(`/api/incidents?${params}`);
  },
  
  getById: (id: string) => {
    return fetchAPI(`/api/incidents/${id}`);
  },
  
  create: (data: {
    type: string;
    severity: string;
    location: string;
    description: string;
    lat?: number;
    lng?: number;
  }) => {
    return fetchAPI('/api/incidents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  update: (id: string, data: Partial<any>) => {
    return fetchAPI(`/api/incidents/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },
  
  delete: (id: string) => {
    return fetchAPI(`/api/incidents/${id}`, {
      method: 'DELETE',
    });
  },
};

// Alerts API
export const alertsAPI = {
  getActive: () => {
    return fetchAPI('/api/alerts/active');
  },
  
  getAll: () => {
    return fetchAPI('/api/alerts');
  },
  
  create: (data: {
    type: string;
    message: string;
    severity: string;
    area?: string;
  }) => {
    return fetchAPI('/api/alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Resources API
export const resourcesAPI = {
  getByType: (type: string) => {
    return fetchAPI(`/api/resources?type=${type}`);
  },
  
  getAll: () => {
    return fetchAPI('/api/resources');
  },
};

// Chat API
export const chatAPI = {
  sendMessage: (message: string) => {
    return fetchAPI('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};

// Admin API
export const adminAPI = {
  getStats: () => {
    return fetchAPI('/api/admin/stats');
  },
  
  verifyIncident: (id: string) => {
    return fetchAPI(`/api/admin/incidents/${id}/verify`, {
      method: 'POST',
    });
  },
  
  rejectIncident: (id: string, reason: string) => {
    return fetchAPI(`/api/admin/incidents/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};
