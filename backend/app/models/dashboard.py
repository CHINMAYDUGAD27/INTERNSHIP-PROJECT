from sqlalchemy import Column, Integer

from app.database.database import Base


class Dashboard(Base):
    __tablename__ = "dashboard"

    id = Column(Integer, primary_key=True, index=True)

    total_projects = Column(Integer, default=0)

    completed_projects = Column(Integer, default=0)

    ongoing_projects = Column(Integer, default=0)

    total_budget = Column(Integer, default=0)

    budget_used = Column(Integer, default=0)

    total_devotees = Column(Integer, default=0)

    police_personnel = Column(Integer, default=0)

    medical_camps = Column(Integer, default=0)

    ambulances = Column(Integer, default=0)

    buses = Column(Integer, default=0)

    parking_spaces = Column(Integer, default=0)