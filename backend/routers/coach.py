"""POST /coach — RAG 감각 기반 코칭 피드백."""
from __future__ import annotations
from fastapi import APIRouter
from pydantic import BaseModel
import services.rag_service as rag_service

router = APIRouter()

class CoachRequest(BaseModel):
    stage_id: int
    user_message: str = ""
    score: int = 0
    pitch_accuracy: int = 0
    tension_detail: str = ""  # 긴장 부위/상태 (선택)

class CoachResponse(BaseModel):
    feedback: str
    next_exercise: str
    encouragement: str

@router.post("/coach", response_model=CoachResponse)
async def coach(req: CoachRequest):
    result = rag_service.get_coaching_feedback(
        stage_id=req.stage_id, user_message=req.user_message,
        score=req.score, pitch_accuracy=req.pitch_accuracy,
        tension_detail=req.tension_detail,
    )
    return CoachResponse(**result)
