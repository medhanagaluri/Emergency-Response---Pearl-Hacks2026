from fastapi import APIRouter, HTTPException, Depends
from typing import List
from app.models import Alert, AlertCreate
from app.db import get_db
from datetime import datetime

router = APIRouter()

@router.get("/", response_model=List[Alert])
async def get_all_alerts(db = Depends(get_db)):
    """Get all alerts"""
    try:
        response = db.table('alerts').select("*").order('created_at', desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/active", response_model=List[Alert])
async def get_active_alerts(db = Depends(get_db)):
    """Get all active alerts"""
    try:
        response = db.table('alerts').select("*").eq('is_active', True).order('created_at', desc=True).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Alert)
async def create_alert(alert: AlertCreate, db = Depends(get_db)):
    """Create a new alert (admin only)"""
    try:
        alert_data = {
            **alert.dict(),
            "is_active": True,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = db.table('alerts').insert(alert_data).execute()
        
        # TODO: Trigger push notifications
        # TODO: Send SMS to users in affected area
        # TODO: Update WebSocket connections
        
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{alert_id}/deactivate")
async def deactivate_alert(alert_id: str, db = Depends(get_db)):
    """Deactivate an alert"""
    try:
        response = db.table('alerts').update({
            "is_active": False
        }).eq('id', alert_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{alert_id}")
async def delete_alert(alert_id: str, db = Depends(get_db)):
    """Delete an alert (admin only)"""
    try:
        response = db.table('alerts').delete().eq('id', alert_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {"message": "Alert deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
