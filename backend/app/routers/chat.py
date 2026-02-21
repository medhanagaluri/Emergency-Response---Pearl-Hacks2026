from fastapi import APIRouter, HTTPException
from app.models import ChatMessage, ChatResponse
import os

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat(message: ChatMessage):
    """Process chat message and return AI-generated response"""
    try:
        user_message = message.message.lower()
        
        # TODO: Integrate with AI service (OpenAI, Claude, etc.)
        # TODO: Add context about current incidents and alerts
        # TODO: Provide personalized safety recommendations
        
        # Simple keyword-based responses (replace with AI)
        response_text = "I'm here to help with emergency safety information."
        suggested_resources = []
        
        if "fire" in user_message:
            response_text = "For fire emergencies, remember to stay calm and evacuate if it's unsafe. I've included fire safety guidelines below."
            suggested_resources = [{
                "type": "fire",
                "title": "Fire Safety Guidelines",
                "description": "Essential steps during a fire emergency"
            }]
        elif "flood" in user_message:
            response_text = "During a flood, move to higher ground immediately. Never walk or drive through flood water. Check the flood safety resources below."
            suggested_resources = [{
                "type": "flood",
                "title": "Flood Safety Guidelines",
                "description": "Critical actions during floods"
            }]
        elif "earthquake" in user_message:
            response_text = "During an earthquake, DROP, COVER, and HOLD ON. See detailed earthquake safety steps below."
            suggested_resources = [{
                "type": "earthquake",
                "title": "Earthquake Safety Guidelines",
                "description": "How to protect yourself during earthquakes"
            }]
        elif "help" in user_message or "emergency" in user_message:
            response_text = "I can provide safety information for various emergencies including fires, floods, earthquakes, and more. What type of emergency information do you need?"
        
        return ChatResponse(
            message=response_text,
            suggested_resources=suggested_resources
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def chat_health():
    """Check if chat service is available"""
    # TODO: Check AI service connectivity
    return {"status": "operational", "ai_enabled": False}
