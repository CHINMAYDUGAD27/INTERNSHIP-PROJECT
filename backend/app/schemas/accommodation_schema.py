from pydantic import BaseModel
from datetime import date
from typing import Optional


class AccommodationCreate(BaseModel):
    devotee_name: str
    contact: str
    location: str
    check_in: date
    check_out: Optional[date] = None
    token_number: str
    darshan_slot: str
    status: str = "Waiting"


class AccommodationUpdate(BaseModel):
    devotee_name: str
    contact: str
    location: str
    check_in: date
    check_out: Optional[date] = None
    token_number: str
    darshan_slot: str
    status: str


class AccommodationResponse(BaseModel):
    id: int
    devotee_name: str
    contact: str
    location: str
    check_in: date
    check_out: Optional[date] = None
    token_number: str
    darshan_slot: str
    status: str

    class Config:
        from_attributes = True
