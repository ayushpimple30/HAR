from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from database.db import get_db
from models.complaint import Complaint
from models.notification import Notification
from models.user import User
from schemas.complaint import ComplaintCreate, ComplaintOut, ComplaintStatusUpdate
from services.auth import get_current_user, require_role

router = APIRouter(prefix="/complaints", tags=["Complaints"])


def _to_schema(complaint: Complaint) -> ComplaintOut:
    return ComplaintOut(
        id=complaint.id,
        title=complaint.title,
        description=complaint.description,
        location=complaint.location,
        category=complaint.category,
        status=complaint.status,
        citizen_id=complaint.citizen_id,
        citizen_name=complaint.citizen.full_name,
        created_at=complaint.created_at,
        updated_at=complaint.updated_at,
    )


@router.post("", response_model=ComplaintOut, status_code=201)
async def create_complaint(
    payload: ComplaintCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    require_role(current_user, ["citizen"])
    complaint = Complaint(**payload.model_dump(), citizen_id=current_user.id)
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return _to_schema(complaint)


@router.get("/mine", response_model=list[ComplaintOut])
async def list_my_complaints(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    require_role(current_user, ["citizen"])
    complaints = (
        db.query(Complaint)
        .filter(Complaint.citizen_id == current_user.id)
        .order_by(Complaint.created_at.desc())
        .all()
    )
    return [_to_schema(c) for c in complaints]


@router.get("", response_model=list[ComplaintOut])
async def list_all_complaints(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    require_role(current_user, ["admin"])
    complaints = db.query(Complaint).order_by(Complaint.created_at.desc()).all()
    return [_to_schema(c) for c in complaints]


@router.get("/stats/admin")
async def complaint_stats(
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    require_role(current_user, ["admin"])
    total = db.query(func.count(Complaint.id)).scalar() or 0
    grouped = db.query(Complaint.status, func.count(Complaint.id)).group_by(Complaint.status).all()
    by_status = {status: count for status, count in grouped}
    return {
        "total": total,
        "by_status": {
            "Pending": by_status.get("Pending", 0),
            "In Progress": by_status.get("In Progress", 0),
            "Resolved": by_status.get("Resolved", 0),
        },
    }


@router.patch("/{complaint_id}/status", response_model=ComplaintOut)
async def update_status(
    complaint_id: int,
    payload: ComplaintStatusUpdate,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    require_role(current_user, ["admin"])
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    if complaint.status != payload.status:
        complaint.status = payload.status
        db.add(
            Notification(
                user_id=complaint.citizen_id,
                message=f"Your complaint '{complaint.title}' status changed to {payload.status}.",
            )
        )
    db.commit()
    db.refresh(complaint)
    return _to_schema(complaint)
