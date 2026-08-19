from pydantic import BaseModel
from datetime import date
from typing import Optional


class SafetyCreate(BaseModel):
    checkpoint_name: str
    zone: str
    officers_deployed: int
    barricading_status: str = "Inactive"
    gate_status: str = "Closed"
    crowd_density: str = "Low"
    last_updated: date
    remarks: Optional[str] = None


class SafetyUpdate(BaseModel):
    checkpoint_name: str
    zone: str
    officers_deployed: int
    barricading_status: str
    gate_status: str
    crowd_density: str
    last_updated: date
    remarks: Optional[str] = None


class SafetyResponse(BaseModel):
    id: int
    checkpoint_name: str
    zone: str
    officers_deployed: int
    barricading_status: str
    gate_status: str
    crowd_density: str
    last_updated: date
    remarks: Optional[str] = None

    class Config:
        from_attributes = True
