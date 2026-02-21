from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums
class IncidentType(str, Enum):
    FIRE = "fire"
    FLOOD = "flood"
    EARTHQUAKE = "earthquake"
    STORM = "storm"
    ACCIDENT = "accident"
    OTHER = "other"

class SeverityLevel(str, Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class IncidentStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    IN_PROGRESS = "in-progress"
    RESOLVED = "resolved"
    REJECTED = "rejected"

# Incident Models
class IncidentBase(BaseModel):
    type: IncidentType
    severity: SeverityLevel
    location: str
    description: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class IncidentCreate(IncidentBase):
    pass

class IncidentUpdate(BaseModel):
    type: Optional[IncidentType] = None
    severity: Optional[SeverityLevel] = None
    status: Optional[IncidentStatus] = None
    description: Optional[str] = None

class Incident(IncidentBase):
    id: str
    status: IncidentStatus
    reported_by: Optional[str] = None
    verified_by: Optional[str] = None
    media: Optional[List[str]] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Alert Models
class AlertBase(BaseModel):
    type: str
    message: str
    severity: SeverityLevel
    area: Optional[str] = None

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: str
    is_active: bool
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Resource Models
class SafetyResourceBase(BaseModel):
    type: str
    title: str
    description: str
    steps: List[str]
    external_links: Optional[List[dict]] = []

class SafetyResource(SafetyResourceBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Chat Models
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    message: str
    suggested_resources: Optional[List[dict]] = []

# Admin Models
class AdminStats(BaseModel):
    total_incidents: int
    active_alerts: int
    pending_review: int
    resolved_today: int

class VerifyIncident(BaseModel):
    verified_by: str

class RejectIncident(BaseModel):
    reason: str
