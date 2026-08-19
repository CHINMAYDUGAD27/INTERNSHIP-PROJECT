from sqlalchemy import Column, Integer, String
from app.database.database import Base


class SadhuGram(Base):
    __tablename__ = "sadhu_gram"

    id = Column(Integer, primary_key=True, index=True)
    akhara_name = Column(String(150), nullable=False)
    zone = Column(String(100), nullable=False)
    camp_number = Column(String(50), nullable=False)
    allocated_area_sqm = Column(Integer, nullable=False)
    capacity = Column(Integer, nullable=False)
    sadhu_count = Column(Integer, nullable=False)
    status = Column(String(50), nullable=False, default="Active")
