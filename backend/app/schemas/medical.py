from typing import Optional
from pydantic import BaseModel


class MedicalCreate(BaseModel):
    location: str
    medical_camp: str
    available_doctors: int
    available_nurses: int
    available_ambulances: int
    expected_patients: int
    actual_patients: int
    emergency_level: Optional[str] = None


class MedicalUpdate(BaseModel):
    location: str
    medical_camp: str
    available_doctors: int
    available_nurses: int
    available_ambulances: int
    expected_patients: int
    actual_patients: int
    emergency_level: Optional[str] = None


class MedicalResponse(BaseModel):
    id: int
    location: str
    medical_camp: str
    available_doctors: int
    available_nurses: int
    available_ambulances: int
    expected_patients: int
    actual_patients: int
    emergency_level: str

    class Config:
        from_attributes = True