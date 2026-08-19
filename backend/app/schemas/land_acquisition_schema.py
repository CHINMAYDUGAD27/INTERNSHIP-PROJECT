from pydantic import BaseModel
from datetime import date
from typing import Optional


class LandAcquisitionCreate(BaseModel):
    parcel_id: str
    owner_name: str
    area_sqm: float
    location: str
    purpose: str
    status: str = "Pending"
    compensation_amount: float
    acquisition_date: Optional[date] = None


class LandAcquisitionUpdate(BaseModel):
    parcel_id: str
    owner_name: str
    area_sqm: float
    location: str
    purpose: str
    status: str
    compensation_amount: float
    acquisition_date: Optional[date] = None


class LandAcquisitionResponse(BaseModel):
    id: int
    parcel_id: str
    owner_name: str
    area_sqm: float
    location: str
    purpose: str
    status: str
    compensation_amount: float
    acquisition_date: Optional[date] = None

    class Config:
        from_attributes = True
