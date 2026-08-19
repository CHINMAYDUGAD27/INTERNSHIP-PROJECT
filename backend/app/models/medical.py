from sqlalchemy import Column, Integer, String
from app.database.database import Base


class Medical(Base):

    __tablename__ = "medical_data"

    id = Column(Integer, primary_key=True, index=True)

    location = Column(String(100), nullable=False)

    medical_camp = Column(String(100), nullable=False)

    available_doctors = Column(Integer, nullable=False)

    available_nurses = Column(Integer, nullable=False)

    available_ambulances = Column(Integer, nullable=False)

    expected_patients = Column(Integer, nullable=False)

    actual_patients = Column(Integer, nullable=False)

    emergency_level = Column(String(50))