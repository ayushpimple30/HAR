from sqlalchemy import Column, DateTime, Enum, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database.db import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(Enum("admin", "citizen", name="role_enum"), nullable=False, default="citizen")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    complaints = relationship("Complaint", back_populates="citizen", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
