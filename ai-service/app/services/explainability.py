def explanation(risk: str, pain_level: int, fever: bool, redness: bool, discharge: bool, infection_probability: float, trend: str) -> str:
    reasons: list[str] = []
    if pain_level >= 8:
        reasons.append(f"Pain level is high ({pain_level}/10).")
    elif pain_level >= 5:
        reasons.append(f"Pain level is moderate ({pain_level}/10).")
    if fever:
        reasons.append("Fever reported.")
    if redness:
        reasons.append("Redness reported by patient.")
    if discharge:
        reasons.append("Discharge reported by patient.")
    reasons.append(f"Image/model infection probability: {infection_probability:.0%}.")
    reasons.append(f"Recovery trend: {trend}.")

    recommendation = {
        "RED": "Immediate clinical assessment recommended.",
        "YELLOW": "Close monitoring and follow-up advised.",
        "GREEN": "Continue routine postoperative care.",
    }[risk]

    return f"Risk: {risk}. " + " ".join(reasons) + f" {recommendation}"
