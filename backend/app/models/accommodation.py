from sqlalchemy import Column, Integer, String, Date
from app.database.database import Base


class Accommodation(Base):
    __tablename__ = "accommodation"

    id = Column(Integer, primary_key=True, index=True)
    devotee_name = Column(String(150), nullable=False)
    contact = Column(String(20), nullable=False)
    location = Column(String(150), nullable=False)
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=True)
    token_number = Column(String(20), nullable=False)
    darshan_slot = Column(String(50), nullable=False)
    status = Column(String(50), nullable=False, default="Waiting")
