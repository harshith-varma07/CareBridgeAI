from pydantic import BaseModel, Field


class AnalyzeRequest(BaseModel):
    patientId: str
    painLevel: int = Field(ge=0, le=10)
    fever: bool
    redness: bool
    discharge: bool
    imageBase64: str | None = None
    history: list[dict] = []


class AnalyzeResponse(BaseModel):
    infectionProbability: float
    rednessScore: float
    trend: str
    risk: str
    confidence: float
    explanation: str
