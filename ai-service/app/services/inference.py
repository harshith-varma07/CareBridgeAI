import numpy as np
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

MODEL_DIR = Path(__file__).resolve().parents[2] / 'training' / 'models'

_model_weights = None
_model_intercept = None


def _load_model():
    """Load trained LogisticRegression coefficients from disk."""
    global _model_weights, _model_intercept
    coef_path = MODEL_DIR / 'coef.npy'
    intercept_path = MODEL_DIR / 'intercept.npy'
    if coef_path.exists() and intercept_path.exists():
        _model_weights = np.load(coef_path)
        _model_intercept = np.load(intercept_path)
        logger.info('Loaded trained model from %s', MODEL_DIR)
    else:
        logger.warning('No trained model found at %s, using rule-based fallback', MODEL_DIR)


def predict_infection_probability(features: dict, pain_level: int, fever: bool, discharge: bool) -> float:
    """Predict infection probability using the trained model or a deterministic fallback.

    Args:
        features: Dict with image analysis results including 'rednessScore'.
        pain_level: Patient-reported pain level (0-10).
        fever: Whether the patient has a fever.
        discharge: Whether the patient reports discharge.

    Returns:
        Infection probability as a float in [0, 1].
    """
    if _model_weights is None:
        _load_model()

    if _model_weights is not None and _model_intercept is not None:
        # Use trained LogisticRegression model
        # Features: [pain, fever, redness, discharge, redness_score]
        X = np.array([[
            pain_level,
            int(fever),
            int(features.get('rednessScore', 0) > 0.5),
            int(discharge),
            features.get('rednessScore', 0.2),
        ]])
        logit = np.dot(X, _model_weights.T) + _model_intercept
        probability = 1 / (1 + np.exp(-logit))
        return float(np.clip(probability, 0, 1).item())
    else:
        # Deterministic rule-based fallback (no random jitter)
        base = 0.15
        base += pain_level * 0.05
        base += 0.2 if fever else 0
        base += 0.2 if discharge else 0
        base += features.get('rednessScore', 0) * 0.3
        return float(max(0.0, min(1.0, base)))
