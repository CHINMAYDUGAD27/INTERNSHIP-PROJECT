from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.medical import Medical
from app.schemas.medical import (
    MedicalCreate,
    MedicalUpdate,
    MedicalResponse
)

router = APIRouter(
    prefix="/medical",
    tags=["Medical Emergency"]
)

@router.post("/", response_model=MedicalResponse)
def create_medical(
    medical: MedicalCreate,
    db: Session = Depends(get_db)
):

    new_record = Medical(
        **medical.model_dump()
    )

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return new_record


@router.get("/", response_model=list[MedicalResponse])
def get_all_medical(
    db: Session = Depends(get_db)
):

    return db.query(Medical).all()


@router.get("/{medical_id}", response_model=MedicalResponse)
def get_medical(
    medical_id: int,
    db: Session = Depends(get_db)
):

    medical = db.query(Medical).filter(
        Medical.id == medical_id
    ).first()

    if not medical:
        raise HTTPException(
            status_code=404,
            detail="Medical record not found"
        )

    return medical

@router.put("/{medical_id}", response_model=MedicalResponse)
def update_medical(
    medical_id: int,
    medical_data: MedicalUpdate,
    db: Session = Depends(get_db)
):

    medical = db.query(Medical).filter(
        Medical.id == medical_id
    ).first()

    if not medical:
        raise HTTPException(
            status_code=404,
            detail="Medical record not found"
        )

    for key, value in medical_data.model_dump().items():
        setattr(medical, key, value)

    db.commit()
    db.refresh(medical)

    return medical

@router.delete("/{medical_id}")
def delete_medical(
    medical_id: int,
    db: Session = Depends(get_db)
):

    medical = db.query(Medical).filter(
        Medical.id == medical_id
    ).first()

    if not medical:
        raise HTTPException(
            status_code=404,
            detail="Medical record not found"
        )

    db.delete(medical)
    db.commit()

    return {
        "message": "Medical record deleted successfully"
    }

