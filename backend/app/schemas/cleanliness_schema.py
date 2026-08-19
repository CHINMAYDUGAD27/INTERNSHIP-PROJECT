from pydantic import BaseModel
from datetime import date
from typing import Optional


class CleanlinessCreate(BaseModel):
    zone: str
    ghat_name: str
    sanitation_status: str = "Clean"
    water_quality_index: float
    ph_level: float
    dissolved_oxygen: float
    last_checked: date
    remarks: Optional[str] = None


class CleanlinessUpdate(BaseModel):
    zone: str
    ghat_name: str
    sanitation_status: str
    water_quality_index: float
    ph_level: float
    dissolved_oxygen: float
    last_checked: date
    remarks: Optional[str] = None


class CleanlinessResponse(BaseModel):
    id: int
    zone: str
    ghat_name: str
    sanitation_status: str
    water_quality_index: float
    ph_level: float
    dissolved_oxygen: float
    last_checked: date
    remarks: Optional[str] = None

    class Config:
        from_attributes = True
