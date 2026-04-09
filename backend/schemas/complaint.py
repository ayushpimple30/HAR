from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ComplaintCreate(BaseModel):
    title: str = Field(min_length=3, max_length=200)
    description: str = Field(min_length=10)
    location: str = Field(min_length=2, max_length=200)
    category: str = Field(min_length=2, max_length=100)


class ComplaintStatusUpdate(BaseModel):
    status: Literal["Pending", "In Progress", "Resolved"]


class ComplaintOut(BaseModel):
    id: int
    title: str
    description: str
    location: str
    category: str
    status: str
    citizen_id: int
    citizen_name: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
