from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.budget_schema import BudgetCreate

from app.crud.budget_crud import (
    create_budget,
    get_all_budgets,
    get_budget,
    update_budget,
    delete_budget
)

router = APIRouter(
    prefix="/budgets",
    tags=["Budget Management"]
)


@router.post("/")
def add_budget(
    budget: BudgetCreate,
    db: Session = Depends(get_db)
):
    return create_budget(db, budget)


@router.get("/")
def view_budgets(
    db: Session = Depends(get_db)
):
    return get_all_budgets(db)


@router.get("/{budget_id}")
def view_budget(
    budget_id: int,
    db: Session = Depends(get_db)
):

    budget = get_budget(db, budget_id)

    if not budget:
        raise HTTPException(
            status_code=404,
            detail="Budget Not Found"
        )

    return budget


@router.put("/{budget_id}")
def edit_budget(
    budget_id: int,
    budget: BudgetCreate,
    db: Session = Depends(get_db)
):

    updated = update_budget(db, budget_id, budget)

    if not updated:
        raise HTTPException(
            status_code=404,
            detail="Budget Not Found"
        )

    return updated


@router.delete("/{budget_id}")
def remove_budget(
    budget_id: int,
    db: Session = Depends(get_db)
):

    deleted = delete_budget(db, budget_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Budget Not Found"
        )

    return deleted