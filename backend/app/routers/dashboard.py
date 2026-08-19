from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.crud.dashboard_crud import get_dashboard

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/")
def dashboard(db: Session = Depends(get_db)):

    return get_dashboard(db)