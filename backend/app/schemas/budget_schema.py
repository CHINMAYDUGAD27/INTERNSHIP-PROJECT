from pydantic import BaseModel


class BudgetCreate(BaseModel):

    department: str

    allocated_budget: float

    spent_budget: float

    financial_year: str

    remarks: str


class BudgetResponse(BudgetCreate):

    id: int

    remaining_budget: float

    class Config:
        from_attributes = True