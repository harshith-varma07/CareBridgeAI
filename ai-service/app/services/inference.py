import random


def predict_infection_probability(features: dict, pain_level: int, fever: bool, discharge: bool) -> float:
    base = 0.15
    base += pain_level * 0.05
    base += 0.2 if fever else 0
    base += 0.2 if discharge else 0
    base += features.get("rednessScore", 0) * 0.3
    jitter = random.uniform(-0.03, 0.03)
    return float(max(0, min(1, base + jitter)))
