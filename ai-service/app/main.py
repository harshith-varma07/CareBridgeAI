from fastapi import FastAPI

from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.explainability import explanation
from app.services.hybrid_risk import calculate_risk
from app.services.image_processing import image_features
from app.services.inference import predict_infection_probability
from app.services.trend_analysis import trend

app = FastAPI(title="CareBridge AI Service", version="1.0.0")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/ai/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    features = image_features(payload.imageBase64)
    infection_probability = predict_infection_probability(
        features, payload.painLevel, payload.fever, payload.discharge
    )
    trend_value = trend(
        payload.history,
        payload.painLevel,
        payload.fever,
        payload.redness,
        payload.discharge,
    )
    risk = calculate_risk(
        payload.painLevel,
        payload.fever,
        payload.redness,
        payload.discharge,
        infection_probability,
    )
    confidence = float(max(0.6, min(0.95, 0.7 + features["quality"] * 0.2)))
    message = explanation(
        risk,
        payload.painLevel,
        payload.fever,
        payload.redness,
        payload.discharge,
        infection_probability,
        trend_value,
    )

    return AnalyzeResponse(
        infectionProbability=infection_probability,
        rednessScore=features["rednessScore"],
        trend=trend_value,
        risk=risk,
        confidence=confidence,
        explanation=message,
    )
