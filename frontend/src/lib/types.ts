// Incident types
export interface Incident {
  id: string;
  type: IncidentType;
  severity: SeverityLevel;
  location: string;
  latitude?: number;
  longitude?: number;
  description: string;
  status: IncidentStatus;
  reportedBy?: string;
  verifiedBy?: string;
  media?: string[];
  createdAt: string;
  updatedAt: string;
}

export type IncidentType = 'fire' | 'flood' | 'earthquake' | 'storm' | 'accident' | 'other';

export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';

export type IncidentStatus = 'pending' | 'verified' | 'in-progress' | 'resolved' | 'rejected';

// Alert types
export interface Alert {
  id: string;
  type: string;
  message: string;
  severity: SeverityLevel;
  area?: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
}

// Resource types
export interface SafetyResource {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  steps: string[];
  externalLinks?: ExternalLink[];
  downloadableContent?: string;
}

export type ResourceType = 'fire' | 'flood' | 'earthquake' | 'storm' | 'general';

export interface ExternalLink {
  title: string;
  url: string;
}

// Chat types
export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  suggestedResources?: SafetyResource[];
}

// Admin types
export interface AdminStats {
  totalIncidents: number;
  activeAlerts: number;
  pendingReview: number;
  resolvedToday: number;
}

// Form types
export interface IncidentFormData {
  type: IncidentType;
  severity: SeverityLevel;
  location: string;
  latitude?: number;
  longitude: number;
  description: string;
  media?: File[];
}

// Filter types
export interface IncidentFilters {
  type?: IncidentType;
  severity?: SeverityLevel;
  status?: IncidentStatus;
  dateFrom?: string;
  dateTo?: string;
}

// Map types
export interface MapPin {
  id: string;
  latitude: number;
  longitude: number;
  type: IncidentType;
  severity: SeverityLevel;
  title: string;
}
