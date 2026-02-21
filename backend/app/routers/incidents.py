from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from app.models import Incident, IncidentCreate, IncidentUpdate, IncidentType, SeverityLevel, IncidentStatus
from app.db import get_db
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[Incident])
async def get_incidents(
    type: Optional[IncidentType] = None,
    severity: Optional[SeverityLevel] = None,
    status: Optional[IncidentStatus] = None,
    db = Depends(get_db)
):
    """Get all incidents with optional filters"""
    try:
        query = db.table('incidents').select("*")
        
        if type:
            query = query.eq('type', type.value)
        if severity:
            query = query.eq('severity', severity.value)
        if status:
            query = query.eq('status', status.value)
        
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{incident_id}", response_model=Incident)
async def get_incident(incident_id: str, db = Depends(get_db)):
    """Get a specific incident by ID"""
    try:
        response = db.table('incidents').select("*").eq('id', incident_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Incident)
async def create_incident(incident: IncidentCreate, db = Depends(get_db)):
    """Create a new incident report"""
    try:
        incident_data = {
            **incident.dict(),
            "status": IncidentStatus.PENDING.value,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        response = db.table('incidents').insert(incident_data).execute()
        
        # TODO: Trigger alert system if severity is critical
        # TODO: Send notifications to nearby users
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{incident_id}", response_model=Incident)
async def update_incident(
    incident_id: str,
    incident_update: IncidentUpdate,
    db = Depends(get_db)
):
    """Update an incident"""
    try:
        update_data = {
            **incident_update.dict(exclude_unset=True),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        response = db.table('incidents').update(update_data).eq('id', incident_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{incident_id}")
async def delete_incident(incident_id: str, db = Depends(get_db)):
    """Delete an incident (admin only)"""
    try:
        response = db.table('incidents').delete().eq('id', incident_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        return {"message": "Incident deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
