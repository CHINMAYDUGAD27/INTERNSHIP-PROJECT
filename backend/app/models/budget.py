from sqlalchemy import Column, Integer, String, Float
from app.database.database import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)

    department = Column(String(100), nullable=False)

    allocated_budget = Column(Float, nullable=False)

    spent_budget = Column(Float, default=0)

    remaining_budget = Column(Float, default=0)

    financial_year = Column(String(20), nullable=False)

    remarks = Column(String(300))