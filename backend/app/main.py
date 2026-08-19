from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine

# Import all models so SQLAlchemy creates the tables
from app.models.user import User
from app.models.dashboard import Dashboard
from app.models.project import Project
from app.models.budget import Budget
from app.models.crowd import Crowd
from app.models.traffic import Traffic
from app.models.medical import Medical
from app.models.sadhu_gram import SadhuGram
from app.models.accommodation import Accommodation
from app.models.cleanliness import Cleanliness
from app.models.land_acquisition import LandAcquisition
from app.models.safety import Safety

# Import all routers
from app.routers import (
    home,
    auth,
    dashboard,
    project,
    budget,
    crowd,
    ai,
    traffic,
    medical,
    sadhu_gram,
    accommodation,
    cleanliness,
    land_acquisition,
    safety
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI-Powered Smart Kumbh Mela Administration & Decision Support System",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    # ── ngrok tunnels (college demo sharing) ──────────────────
    "https://*.ngrok-free.app",
    "https://*.ngrok.io",
    # ── Render deployment ─────────────────────────────────────
    "https://*.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.(ngrok(-free)?)\.(app|io)|https://.*\.onrender\.com",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(home.router)
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(project.router)
app.include_router(budget.router)
app.include_router(crowd.router)
app.include_router(ai.router)
app.include_router(traffic.router)
app.include_router(medical.router)
app.include_router(sadhu_gram.router)
app.include_router(accommodation.router)
app.include_router(cleanliness.router)
app.include_router(land_acquisition.router)
app.include_router(safety.router)
