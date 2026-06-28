def calculate_risk(pain_level: int, fever: bool, redness: bool, discharge: bool, infection_probability: float) -> str:
    if fever or discharge or pain_level >= 8 or infection_probability >= 0.8:
        return "RED"
    if (5 <= pain_level <= 7) or redness or infection_probability >= 0.5:
        return "YELLOW"
    return "GREEN"
