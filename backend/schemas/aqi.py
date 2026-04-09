from datetime import datetime

from pydantic import BaseModel, Field


class AQICreate(BaseModel):
    location: str = Field(default="City Center", min_length=2, max_length=120)
    aqi_value: float = Field(ge=0, le=500)


class AQIOut(BaseModel):
    id: int
    location: str
    aqi_value: float
    category: str
    recorded_at: datetime

    class Config:
        from_attributes = True
