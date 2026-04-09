def aqi_category(value: float) -> str:
    if value <= 50:
        return "Good"
    if value <= 100:
        return "Moderate"
    if value <= 150:
        return "Unhealthy for Sensitive Groups"
    if value <= 200:
        return "Unhealthy"
    if value <= 300:
        return "Very Unhealthy"
    return "Hazardous"
