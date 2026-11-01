
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.gemini_service import generate_debate

router = APIRouter(
    prefix="/api/debate",
    tags=["Debate"]
)


class DebateRequest(BaseModel):
    topic: str = Field(
        min_length=5,
        max_length=300,
        description="The debate topic"
    )


@router.post("/generate")
def create_debate(request: DebateRequest):
    try:
        result = generate_debate(request.topic)

        return {
            "success": True,
            "data": result
        }

    except ValueError as error:
        print("Debate generation error:", error)
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:
        print("Debate generation error:", error)
        raise HTTPException(
            status_code=500,
            detail="Unable to generate debate. Check the backend terminal."
        )
