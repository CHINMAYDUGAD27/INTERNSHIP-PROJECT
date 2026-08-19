from pydantic import BaseModel


class DashboardResponse(BaseModel):

    total_projects: int

    completed_projects: int

    ongoing_projects: int

    total_budget: int

    budget_used: int

    total_devotees: int

    police_personnel: int

    medical_camps: int

    ambulances: int

    buses: int

    parking_spaces: int

    class Config:
        from_attributes = True