from sqlalchemy import Column, Integer, String, Float, Date
from app.database.database import Base


class LandAcquisition(Base):
    __tablename__ = "land_acquisition"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(String(50), nullable=False, unique=True)
    owner_name = Column(String(150), nullable=False)
    area_sqm = Column(Float, nullable=False)
    location = Column(String(200), nullable=False)
    purpose = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False, default="Pending")
    compensation_amount = Column(Float, nullable=False)
    acquisition_date = Column(Date, nullable=True)
