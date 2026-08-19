from sqlalchemy.orm import Session

from app.models.budget import Budget
from app.schemas.budget_schema import BudgetCreate


def create_budget(db: Session, budget: BudgetCreate):

    remaining = budget.allocated_budget - budget.spent_budget

    new_budget = Budget(
        department=budget.department,
        allocated_budget=budget.allocated_budget,
        spent_budget=budget.spent_budget,
        remaining_budget=remaining,
        financial_year=budget.financial_year,
        remarks=budget.remarks
    )

    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)

    return new_budget


def get_all_budgets(db: Session):
    return db.query(Budget).all()


def get_budget(db: Session, budget_id: int):
    return db.query(Budget).filter(Budget.id == budget_id).first()


def update_budget(db: Session, budget_id: int, budget: BudgetCreate):

    db_budget = db.query(Budget).filter(Budget.id == budget_id).first()

    if not db_budget:
        return None

    db_budget.department = budget.department
    db_budget.allocated_budget = budget.allocated_budget
    db_budget.spent_budget = budget.spent_budget
    db_budget.remaining_budget = budget.allocated_budget - budget.spent_budget
    db_budget.financial_year = budget.financial_year
    db_budget.remarks = budget.remarks

    db.commit()
    db.refresh(db_budget)

    return db_budget


def delete_budget(db: Session, budget_id: int):

    db_budget = db.query(Budget).filter(Budget.id == budget_id).first()

    if not db_budget:
        return None

    db.delete(db_budget)
    db.commit()

    return {"message": "Budget Deleted Successfully"}