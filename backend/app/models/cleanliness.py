from sqlalchemy import Column, Integer, String, Float, Date
from app.database.database import Base


class Cleanliness(Base):
    __tablename__ = "cleanliness"

    id = Column(Integer, primary_key=True, index=True)
    zone = Column(String(100), nullable=False)
    ghat_name = Column(String(150), nullable=False)
    sanitation_status = Column(String(50), nullable=False, default="Clean")
    water_quality_index = Column(Float, nullable=False)
    ph_level = Column(Float, nullable=False)
    dissolved_oxygen = Column(Float, nullable=False)
    last_checked = Column(Date, nullable=False)
    remarks = Column(String(300), nullable=True)
