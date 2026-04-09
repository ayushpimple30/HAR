from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import Base, engine
from routers import aqi, auth, complaints, notifications

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Unified Cloud Platform for Smart Cities Services")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def health_check():
    return {"status": "ok", "message": "Smart City API running"}


app.include_router(auth.router)
app.include_router(complaints.router)
app.include_router(aqi.router)
app.include_router(notifications.router)
