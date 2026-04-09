from datetime import datetime, timedelta, timezone

from database.db import Base, SessionLocal, engine
from models.aqi import AQIReading
from models.complaint import Complaint
from models.notification import Notification
from models.user import User
from services.aqi_helper import aqi_category
from services.auth import hash_password


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        admin = db.query(User).filter(User.email == "admin@smartcity.local").first()
        if not admin:
            admin = User(
                full_name="System Admin",
                email="admin@smartcity.local",
                hashed_password=hash_password("Admin@123"),
                role="admin",
            )
            db.add(admin)

        citizen = db.query(User).filter(User.email == "citizen@smartcity.local").first()
        if not citizen:
            citizen = User(
                full_name="Jane Citizen",
                email="citizen@smartcity.local",
                hashed_password=hash_password("Citizen@123"),
                role="citizen",
            )
            db.add(citizen)

        db.commit()
        db.refresh(admin)
        db.refresh(citizen)

        if db.query(Complaint).count() == 0:
            complaints = [
                Complaint(
                    title="Streetlight not working",
                    description="The streetlight near 5th avenue has been out for 3 days.",
                    location="5th Avenue",
                    category="Infrastructure",
                    status="Pending",
                    citizen_id=citizen.id,
                ),
                Complaint(
                    title="Waste collection delay",
                    description="Garbage has not been collected in our block this week.",
                    location="Maple Street",
                    category="Sanitation",
                    status="In Progress",
                    citizen_id=citizen.id,
                ),
            ]
            db.add_all(complaints)

        if db.query(AQIReading).count() == 0:
            base_time = datetime.now(timezone.utc) - timedelta(days=6)
            values = [42, 57, 80, 120, 95, 70, 60]
            readings = [
                AQIReading(
                    location="City Center",
                    aqi_value=value,
                    category=aqi_category(value),
                    recorded_at=base_time + timedelta(days=index),
                )
                for index, value in enumerate(values)
            ]
            db.add_all(readings)

        db.commit()

        if db.query(Notification).count() == 0:
            db.add(
                Notification(
                    user_id=citizen.id,
                    message="Welcome! Track your complaints and city updates here.",
                    is_read=False,
                )
            )
            db.commit()

        print("Seed completed successfully.")
        print("Admin login: admin@smartcity.local / Admin@123")
        print("Citizen login: citizen@smartcity.local / Citizen@123")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
