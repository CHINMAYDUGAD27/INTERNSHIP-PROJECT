from sqlalchemy import Column, Integer, String, Date

from app.database.database import Base


class Crowd(Base):

    __tablename__ = "crowd"

    id = Column(Integer, primary_key=True, index=True)

    date = Column(Date)

    location = Column(String(100))

    expected_visitors = Column(Integer)

    actual_visitors = Column(Integer)

    risk_level = Column(String(50))