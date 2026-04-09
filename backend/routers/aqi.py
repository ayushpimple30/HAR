from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.db import get_db
from models.aqi import AQIReading
from models.user import User
from schemas.aqi import AQICreate, AQIOut
from services.aqi_helper import aqi_category
from services.auth import get_current_user, require_role

router = APIRouter(prefix="/aqi", tags=["AQI"])


@router.post("", response_model=AQIOut, status_code=201)
async def create_aqi_reading(
    payload: AQICreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    require_role(current_user, ["admin"])
    reading = AQIReading(
        location=payload.location,
        aqi_value=payload.aqi_value,
        category=aqi_category(payload.aqi_value),
    )
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


@router.get("/latest", response_model=AQIOut | None)
async def get_latest_aqi(db: Annotated[Session, Depends(get_db)]):
    return db.query(AQIReading).order_by(AQIReading.recorded_at.desc()).first()


@router.get("/history", response_model=list[AQIOut])
async def get_historical_aqi(db: Annotated[Session, Depends(get_db)]):
    return db.query(AQIReading).order_by(AQIReading.recorded_at.asc()).limit(50).all()
