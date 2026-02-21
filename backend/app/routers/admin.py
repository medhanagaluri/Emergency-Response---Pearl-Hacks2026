from fastapi import APIRouter, HTTPException, Depends
from app.models import AdminStats, VerifyIncident, RejectIncident, IncidentStatus
from app.db import get_db
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/stats", response_model=AdminStats)
async def get_admin_stats(db = Depends(get_db)):
    """Get dashboard statistics"""
    try:
        # Total incidents
        total_response = db.table('incidents').select("id", count='exact').execute()
        total_incidents = total_response.count or 0
        
        # Active alerts
        alerts_response = db.table('alerts').select("id", count='exact').eq('is_active', True).execute()
        active_alerts = alerts_response.count or 0
        
        # Pending review
        pending_response = db.table('incidents').select("id", count='exact').eq('status', IncidentStatus.PENDING.value).execute()
        pending_review = pending_response.count or 0
        
        # Resolved today
        today = datetime.utcnow().date().isoformat()
        resolved_response = db.table('incidents').select("id", count='exact').eq('status', IncidentStatus.RESOLVED.value).gte('updated_at', today).execute()
        resolved_today = resolved_response.count or 0
        
        return AdminStats(
            total_incidents=total_incidents,
            active_alerts=active_alerts,
            pending_review=pending_review,
            resolved_today=resolved_today
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/incidents/{incident_id}/verify")
async def verify_incident(
    incident_id: str,
    verify_data: VerifyIncident,
    db = Depends(get_db)
):
    """Verify an incident report"""
    try:
        response = db.table('incidents').update({
            "status": IncidentStatus.VERIFIED.value,
            "verified_by": verify_data.verified_by,
            "updated_at": datetime.utcnow().isoformat()
        }).eq('id', incident_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        # TODO: Send notification to reporter
        # TODO: Update map pins
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/incidents/{incident_id}/reject")
async def reject_incident(
    incident_id: str,
    reject_data: RejectIncident,
    db = Depends(get_db)
):
    """Reject an incident report"""
    try:
        response = db.table('incidents').update({
            "status": IncidentStatus.REJECTED.value,
            "updated_at": datetime.utcnow().isoformat()
        }).eq('id', incident_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        # TODO: Send notification to reporter with reason
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/incidents/{incident_id}/resolve")
async def resolve_incident(incident_id: str, db = Depends(get_db)):
    """Mark an incident as resolved"""
    try:
        response = db.table('incidents').update({
            "status": IncidentStatus.RESOLVED.value,
            "updated_at": datetime.utcnow().isoformat()
        }).eq('id', incident_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Incident not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
