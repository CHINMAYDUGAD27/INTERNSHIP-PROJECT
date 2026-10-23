from pydantic import BaseModel
from datetime import date


class CrowdCreate(BaseModel):

    date: date

    location: str

    expected_visitors: int

    actual_visitors: int


class CrowdResponse(CrowdCreate):

    id: int

    risk_level: str

    class Config:
        from_attributes = True