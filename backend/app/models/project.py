from sqlalchemy import Column, Integer, String, Date, Text
from app.database.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)

    project_name = Column(String(200), nullable=False)

    department = Column(String(100), nullable=False)

    location = Column(String(150), nullable=False)

    budget = Column(Integer, nullable=False)

    progress = Column(Integer, default=0)

    status = Column(String(50), default="Pending")

    start_date = Column(Date)

    end_date = Column(Date)

    description = Column(Text)