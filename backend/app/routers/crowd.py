from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.schemas.crowd_schema import CrowdCreate

from app.crud.crowd_crud import create_crowd,get_all_records

from app.ml.prediction import predict_risk

router = APIRouter(

    prefix="/crowd",

    tags=["Crowd Prediction"]

)


@router.post("/preview-predict")
def preview_predict_crowd(
    expected_visitors: int = 1,
    actual_visitors: int = 0
):
    """Live ML risk prediction preview — no DB write."""
    risk = predict_risk(expected_visitors, actual_visitors)
    return {"risk_level": risk}


@router.post("/")
def add_record(

    crowd:CrowdCreate,

    db:Session=Depends(get_db)

):

    return create_crowd(db,crowd)


@router.get("/")
def view_records(

    db:Session=Depends(get_db)

):

    return get_all_records(db)