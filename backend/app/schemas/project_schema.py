from pydantic import BaseModel
from datetime import date


class ProjectCreate(BaseModel):

    project_name: str

    department: str

    location: str

    budget: int

    progress: int

    status: str

    start_date: date

    end_date: date

    description: str


class ProjectResponse(ProjectCreate):

    id: int

    class Config:
        from_attributes = True