from sqlalchemy import Column, Integer, String, Date
from app.database.database import Base


class Safety(Base):
    __tablename__ = "safety"

    id = Column(Integer, primary_key=True, index=True)
    checkpoint_name = Column(String(150), nullable=False)
    zone = Column(String(100), nullable=False)
    officers_deployed = Column(Integer, nullable=False)
    barricading_status = Column(String(50), nullable=False, default="Inactive")
    gate_status = Column(String(20), nullable=False, default="Closed")
    crowd_density = Column(String(20), nullable=False, default="Low")
    last_updated = Column(Date, nullable=False)
    remarks = Column(String(300), nullable=True)
