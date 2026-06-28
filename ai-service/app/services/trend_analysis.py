def trend(history: list[dict], current_pain: int, fever: bool, redness: bool, discharge: bool) -> str:
    if not history:
        return "Stable"

    recent = history[-3:]
    pain_values = [int(item.get("painLevel", 0)) for item in recent] + [current_pain]

    is_rising_pain = all(pain_values[i] <= pain_values[i + 1] for i in range(len(pain_values) - 1))
    persistent_flags = sum(
        1
        for item in recent
        if item.get("fever") or item.get("redness") or item.get("discharge")
    )
    current_flags = sum([fever, redness, discharge])

    if is_rising_pain or persistent_flags >= 2 or current_flags >= 2:
        return "Increasing"

    if current_pain <= 3 and not fever and not redness and not discharge:
        return "Improving"

    return "Stable"
