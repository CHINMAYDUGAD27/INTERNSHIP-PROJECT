from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: Optional[str] = "Admin"
    department: Optional[str] = None
    mobile_number: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    role: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token:str
    token_type:str
    