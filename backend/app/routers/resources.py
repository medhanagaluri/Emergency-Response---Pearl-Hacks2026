from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from app.models import SafetyResource
from app.db import get_db

router = APIRouter()

@router.get("/", response_model=List[SafetyResource])
async def get_resources(
    type: Optional[str] = Query(None, description="Filter by resource type"),
    db = Depends(get_db)
):
    """Get safety resources, optionally filtered by type"""
    try:
        query = db.table('resources').select("*")
        
        if type:
            query = query.eq('type', type)
        
        response = query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{resource_id}", response_model=SafetyResource)
async def get_resource(resource_id: str, db = Depends(get_db)):
    """Get a specific safety resource by ID"""
    try:
        response = db.table('resources').select("*").eq('id', resource_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Resource not found")
        
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Pre-populated safety resources data
SAFETY_RESOURCES = {
    "fire": {
        "title": "Fire Safety Guidelines",
        "description": "Essential steps to take during a fire emergency",
        "steps": [
            "Alert others and activate fire alarm",
            "If fire is small, use fire extinguisher (P.A.S.S. method)",
            "Evacuate immediately if fire is spreading",
            "Stay low to avoid smoke inhalation",
            "Feel doors before opening - if hot, use alternate exit",
            "Never use elevators during fire",
            "Meet at designated assembly point",
            "Call 911 once safely outside"
        ]
    },
    "flood": {
        "title": "Flood Safety Guidelines",
        "description": "Critical actions during flood situations",
        "steps": [
            "Move to higher ground immediately",
            "Avoid walking through moving water",
            "Do not drive through flooded areas",
            "Turn off utilities if instructed",
            "Monitor weather alerts continuously",
            "Prepare emergency kit with essentials",
            "Stay away from electrical equipment if wet",
            "Wait for official all-clear before returning"
        ]
    },
    "earthquake": {
        "title": "Earthquake Safety Guidelines",
        "description": "How to protect yourself during an earthquake",
        "steps": [
            "DROP, COVER, and HOLD ON",
            "If indoors, stay inside - get under sturdy furniture",
            "If outdoors, move away from buildings and power lines",
            "If in vehicle, pull over and stay inside",
            "Stay away from windows and heavy objects",
            "After shaking stops, check for injuries",
            "Expect aftershocks",
            "Exit building only if safe - use stairs, not elevators"
        ]
    }
}
