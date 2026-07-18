"""Comprehensive unit tests for CareBridge AI service modules."""
import base64
import io

import numpy as np
import pytest
from PIL import Image

from app.services.explainability import explanation
from app.services.hybrid_risk import calculate_risk
from app.services.image_processing import image_features
from app.services.inference import (
    _model_intercept,
    _model_weights,
    predict_infection_probability,
)
from app.services.trend_analysis import trend


# ---------------------------------------------------------------------------
# inference.py tests
# ---------------------------------------------------------------------------

class TestPredictInfectionProbability:
    """Tests for predict_infection_probability()."""

    def test_deterministic_output_same_inputs(self):
        """Same inputs must always produce the same output (no random jitter)."""
        features = {"rednessScore": 0.5}
        result1 = predict_infection_probability(features, 5, True, False)
        result2 = predict_infection_probability(features, 5, True, False)
        assert result1 == result2

    def test_output_range(self):
        """Probability must be in [0, 1]."""
        features = {"rednessScore": 0.9}
        result = predict_infection_probability(features, 10, True, True)
        assert 0.0 <= result <= 1.0

    def test_low_symptoms_low_probability(self):
        """Low symptoms should yield a lower probability than high symptoms."""
        features = {"rednessScore": 0.1}
        low = predict_infection_probability(features, 1, False, False)
        high_features = {"rednessScore": 0.9}
        high = predict_infection_probability(high_features, 10, True, True)
        assert low < high

    def test_no_image_defaults(self):
        """Should work with default rednessScore when not in features."""
        features = {}
        result = predict_infection_probability(features, 3, False, False)
        assert 0.0 <= result <= 1.0

    def test_all_zeros(self):
        """Minimal symptoms should produce a low probability."""
        features = {"rednessScore": 0.0}
        result = predict_infection_probability(features, 0, False, False)
        assert result < 0.5

    def test_all_max(self):
        """Maximal symptoms should produce a high probability."""
        features = {"rednessScore": 1.0}
        result = predict_infection_probability(features, 10, True, True)
        assert result > 0.5


# ---------------------------------------------------------------------------
# image_processing.py tests
# ---------------------------------------------------------------------------

def _make_test_image_b64(width: int = 10, height: int = 10, color: tuple = (255, 0, 0)) -> str:
    """Create a small valid base64-encoded PNG image for testing."""
    img = Image.new("RGB", (width, height), color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode("utf-8")


class TestImageFeatures:
    """Tests for image_features()."""

    def test_no_image_returns_defaults(self):
        """None input should return default features."""
        result = image_features(None)
        assert result["rednessScore"] == 0.2
        assert result["brightness"] == 0.5
        assert result["quality"] == 0.5
        assert result["swellingApproximation"] == 0.3

    def test_empty_string_returns_defaults(self):
        """Empty string should return default features."""
        result = image_features("")
        assert result["rednessScore"] == 0.2

    def test_invalid_base64_returns_defaults(self):
        """Invalid base64 should return defaults without crashing."""
        result = image_features("not_a_valid_base64_image!!!!")
        assert result["rednessScore"] == 0.2
        assert result["brightness"] == 0.5

    def test_oversized_base64_returns_defaults(self):
        """Base64 string exceeding 10 MB should return defaults."""
        huge = "A" * (10 * 1024 * 1024 + 1)
        result = image_features(huge)
        assert result["rednessScore"] == 0.2

    def test_valid_image_returns_features(self):
        """Valid image should return computed features."""
        b64 = _make_test_image_b64(color=(255, 0, 0))
        result = image_features(b64)
        assert "rednessScore" in result
        assert "brightness" in result
        assert "quality" in result
        assert "swellingApproximation" in result
        # A solid red image should have a positive redness score
        assert result["rednessScore"] >= 0

    def test_valid_image_feature_ranges(self):
        """All feature values should be in [0, 1]."""
        b64 = _make_test_image_b64(color=(128, 64, 32))
        result = image_features(b64)
        for key in ("rednessScore", "brightness", "quality", "swellingApproximation"):
            assert 0.0 <= result[key] <= 1.0, f"{key} out of range: {result[key]}"

    def test_defaults_are_independent_copies(self):
        """Returned default dicts should be independent (not shared references)."""
        r1 = image_features(None)
        r2 = image_features(None)
        r1["rednessScore"] = 999
        assert r2["rednessScore"] == 0.2


# ---------------------------------------------------------------------------
# trend_analysis.py tests
# ---------------------------------------------------------------------------

class TestTrend:
    """Tests for trend()."""

    def test_no_history_returns_stable(self):
        """Empty history should return 'Stable'."""
        assert trend([], 3, False, False, False) == "Stable"

    def test_improving_low_pain_no_flags(self):
        """Low current pain and no flags should return 'Improving'."""
        history = [{"painLevel": 5, "fever": False, "redness": False, "discharge": False}]
        result = trend(history, 2, False, False, False)
        assert result == "Improving"

    def test_increasing_rising_pain(self):
        """Monotonically increasing pain should return 'Increasing'."""
        history = [
            {"painLevel": 3},
            {"painLevel": 5},
            {"painLevel": 7},
        ]
        result = trend(history, 9, False, False, False)
        assert result == "Increasing"

    def test_increasing_multiple_current_flags(self):
        """Multiple current symptom flags (>=2) should return 'Increasing'."""
        history = [{"painLevel": 4}]
        result = trend(history, 4, True, True, False)
        assert result == "Increasing"

    def test_increasing_persistent_history_flags(self):
        """Persistent flags in history (>=2) should return 'Increasing'."""
        history = [
            {"painLevel": 3, "fever": True},
            {"painLevel": 4, "redness": True},
        ]
        result = trend(history, 4, False, False, False)
        assert result == "Increasing"

    def test_stable_moderate_pain_no_flags(self):
        """Moderate pain with no flags and non-rising pattern should return 'Stable'."""
        history = [{"painLevel": 5}]
        result = trend(history, 4, False, False, False)
        assert result == "Stable"


# ---------------------------------------------------------------------------
# hybrid_risk.py tests
# ---------------------------------------------------------------------------

class TestCalculateRisk:
    """Tests for calculate_risk()."""

    def test_red_fever(self):
        assert calculate_risk(3, True, False, False, 0.3) == "RED"

    def test_red_discharge(self):
        assert calculate_risk(3, False, False, True, 0.3) == "RED"

    def test_red_high_pain(self):
        assert calculate_risk(8, False, False, False, 0.3) == "RED"

    def test_red_high_probability(self):
        assert calculate_risk(3, False, False, False, 0.8) == "RED"

    def test_yellow_moderate_pain(self):
        assert calculate_risk(6, False, False, False, 0.3) == "YELLOW"

    def test_yellow_redness(self):
        assert calculate_risk(3, False, True, False, 0.3) == "YELLOW"

    def test_yellow_moderate_probability(self):
        assert calculate_risk(3, False, False, False, 0.5) == "YELLOW"

    def test_green_low_everything(self):
        assert calculate_risk(2, False, False, False, 0.1) == "GREEN"

    def test_green_minimal(self):
        assert calculate_risk(0, False, False, False, 0.0) == "GREEN"


# ---------------------------------------------------------------------------
# explainability.py tests
# ---------------------------------------------------------------------------

class TestExplanation:
    """Tests for explanation()."""

    def test_red_risk_explanation(self):
        result = explanation("RED", 9, True, True, True, 0.85, "Increasing")
        assert "RED" in result
        assert "Immediate clinical assessment" in result
        assert "Pain level is high" in result

    def test_yellow_risk_explanation(self):
        result = explanation("YELLOW", 6, False, True, False, 0.55, "Stable")
        assert "YELLOW" in result
        assert "Close monitoring" in result
        assert "Pain level is moderate" in result

    def test_green_risk_explanation(self):
        result = explanation("GREEN", 2, False, False, False, 0.1, "Improving")
        assert "GREEN" in result
        assert "routine postoperative care" in result

    def test_fever_mentioned(self):
        result = explanation("RED", 5, True, False, False, 0.6, "Stable")
        assert "Fever reported" in result

    def test_discharge_mentioned(self):
        result = explanation("RED", 5, False, False, True, 0.6, "Stable")
        assert "Discharge reported" in result

    def test_redness_mentioned(self):
        result = explanation("YELLOW", 5, False, True, False, 0.6, "Stable")
        assert "Redness reported" in result

    def test_trend_mentioned(self):
        result = explanation("GREEN", 2, False, False, False, 0.1, "Improving")
        assert "Improving" in result

    def test_probability_mentioned(self):
        result = explanation("GREEN", 2, False, False, False, 0.15, "Stable")
        assert "15%" in result
