from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.sql import func

from database.db import Base


class AQIReading(Base):
    __tablename__ = "aqi_readings"

    id = Column(Integer, primary_key=True, index=True)
    location = Column(String(120), nullable=False, default="City Center")
    aqi_value = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    recorded_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)
