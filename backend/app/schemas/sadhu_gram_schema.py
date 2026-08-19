from pydantic import BaseModel
from typing import Optional


class SadhuGramCreate(BaseModel):
    akhara_name: str
    zone: str
    camp_number: str
    allocated_area_sqm: int
    capacity: int
    sadhu_count: int
    status: str = "Active"


class SadhuGramUpdate(BaseModel):
    akhara_name: str
    zone: str
    camp_number: str
    allocated_area_sqm: int
    capacity: int
    sadhu_count: int
    status: str


class SadhuGramResponse(BaseModel):
    id: int
    akhara_name: str
    zone: str
    camp_number: str
    allocated_area_sqm: int
    capacity: int
    sadhu_count: int
    status: str

    class Config:
        from_attributes = True
