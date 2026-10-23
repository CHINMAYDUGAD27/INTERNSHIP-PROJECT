from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.medical import Medical
from app.schemas.medical import (
    MedicalCreate,
    MedicalUpdate,
    MedicalResponse
)
from app.ml.medical_prediction import predict_emergency_level

router = APIRouter(
    prefix="/medical",
    tags=["Medical Emergency"]
)

@router.post("/preview-predict")
def preview_predict_medical(
    available_doctors: int = 1,
    available_nurses: int = 1,
    available_ambulances: int = 1,
    expected_patients: int = 1,
    actual_patients: int = 0
):
    """Live ML prediction preview — no DB write."""
    predicted = predict_emergency_level(
        available_doctors=available_doctors,
        available_nurses=available_nurses,
        available_ambulances=available_ambulances,
        expected_patients=expected_patients,
        actual_patients=actual_patients
    )
    return {"emergency_level": predicted}


@router.post("/", response_model=MedicalResponse)
def create_medical(
    medical: MedicalCreate,
    db: Session = Depends(get_db)
):
    # Auto-predict emergency level using ML model
    predicted_level = predict_emergency_level(
        available_doctors=medical.available_doctors,
        available_nurses=medical.available_nurses,
        available_ambulances=medical.available_ambulances,
        expected_patients=medical.expected_patients,
        actual_patients=medical.actual_patients
    )

    data = medical.model_dump()
    data["emergency_level"] = predicted_level

    new_record = Medical(**data)

    db.add(new_record)
    db.commit()
    db.refresh(new_record)

    return new_record


@router.get("/", response_model=list[MedicalResponse])
def get_all_medical(
    db: Session = Depends(get_db)
):
    return db.query(Medical).all()


@router.get("/predict/{medical_id}")
def predict_medical_level(
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

    prediction = predict_emergency_level(
        available_doctors=medical.available_doctors,
        available_nurses=medical.available_nurses,
        available_ambulances=medical.available_ambulances,
        expected_patients=medical.expected_patients,
        actual_patients=medical.actual_patients
    )

    return {
        "medical_id": medical.id,
        "camp": medical.medical_camp,
        "location": medical.location,
        "ml_prediction": {
            "emergency_level": prediction
        }
    }


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

    data_dict = medical_data.model_dump()
    # If emergency_level not provided or recalculating:
    if not data_dict.get("emergency_level"):
        data_dict["emergency_level"] = predict_emergency_level(
            available_doctors=data_dict["available_doctors"],
            available_nurses=data_dict["available_nurses"],
            available_ambulances=data_dict["available_ambulances"],
            expected_patients=data_dict["expected_patients"],
            actual_patients=data_dict["actual_patients"]
        )

    for key, value in data_dict.items():
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
