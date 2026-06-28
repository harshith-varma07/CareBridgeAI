from fastapi.testclient import TestClient

from app.main import app


def test_ai_analyze_returns_expected_shape():
    client = TestClient(app)
    response = client.post(
        "/ai/analyze",
        json={
            "patientId": "507f1f77bcf86cd799439011",
            "painLevel": 8,
            "fever": True,
            "redness": True,
            "discharge": False,
            "history": [{"painLevel": 5, "fever": False}],
        },
    )
    assert response.status_code == 200
    payload = response.json()
    assert payload["risk"] in ["GREEN", "YELLOW", "RED"]
    assert 0 <= payload["infectionProbability"] <= 1
