from pydantic import BaseModel
from datetime import date


class CrowdCreate(BaseModel):

    date: date

    location: str

    expected_visitors: int

    actual_visitors: int

    risk_level: str


class CrowdResponse(CrowdCreate):

    id: int

    class Config:
        from_attributes = True