from sqlalchemy import Column, Integer, String
from app.database.database import Base


class Traffic(Base):

    __tablename__ = "traffic_data"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    location = Column(
        String(100),
        nullable=False
    )

    road_name = Column(
        String(100),
        nullable=False
    )

    vehicle_count = Column(
        Integer,
        nullable=False
    )

    average_speed = Column(
        Integer,
        nullable=False
    )

    weather_condition = Column(
        String(50)
    )

    event_type = Column(
        String(50)
    )