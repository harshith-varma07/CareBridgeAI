import logging
import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.explainability import explanation
from app.services.hybrid_risk import calculate_risk
from app.services.image_processing import image_features
from app.services.inference import predict_infection_probability
from app.services.trend_analysis import trend

logger = logging.getLogger(__name__)

# Configure allowed CORS origins from environment variable or defaults
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5000,http://localhost:19006",
).split(",")

app = FastAPI(
    title="CareBridge AI Service",
    version="1.0.0",
    description=(
        "AI-powered wound infection analysis service. "
        "Accepts patient symptom data and optional wound images (base64, max 10 MB) "
        "to predict infection probability, assess risk, and generate explanations."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    """Log service status on startup."""
    log_level = os.getenv("LOG_LEVEL", "INFO")
    logging.basicConfig(level=getattr(logging, log_level, logging.INFO))
    logger.info("CareBridge AI Service starting up")
    logger.info("CORS origins: %s", CORS_ORIGINS)


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/ai/analyze", response_model=AnalyzeResponse)
def analyze(payload: AnalyzeRequest) -> AnalyzeResponse:
    """Analyze patient symptoms and optional wound image for infection risk.

    Orchestrates image feature extraction, infection probability prediction,
    trend analysis, risk calculation, confidence scoring, and explanation
    generation.
    """
    try:
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
    except Exception as e:
        logger.exception("Error processing analyze request for patient %s", payload.patientId)
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}",
        ) from e
