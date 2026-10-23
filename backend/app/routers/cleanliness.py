from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.cleanliness import Cleanliness
from app.schemas.cleanliness_schema import CleanlinessCreate, CleanlinessUpdate, CleanlinessResponse
from app.ml.cleanliness_prediction import predict_sanitation_status

router = APIRouter(
    prefix="/cleanliness",
    tags=["Cleanliness & River Godavari"]
)


# Live ML prediction preview (no DB write)
@router.post("/preview-predict")
def preview_predict_cleanliness(
    water_quality_index: float = 75.0,
    ph_level: float = 7.2,
    dissolved_oxygen: float = 6.5
):
    """Live ML sanitation status prediction preview — no DB write."""
    status = predict_sanitation_status(
        water_quality_index=water_quality_index,
        ph_level=ph_level,
        dissolved_oxygen=dissolved_oxygen
    )
    return {"sanitation_status": status}


@router.post("/", response_model=CleanlinessResponse)
def create_cleanliness(record: CleanlinessCreate, db: Session = Depends(get_db)):
    predicted_status = predict_sanitation_status(
        water_quality_index=record.water_quality_index,
        ph_level=record.ph_level,
        dissolved_oxygen=record.dissolved_oxygen
    )
    data = record.model_dump()
    data["sanitation_status"] = predicted_status
    new_record = Cleanliness(**data)
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.get("/", response_model=list[CleanlinessResponse])
def get_all_cleanliness(db: Session = Depends(get_db)):
    records = db.query(Cleanliness).all()
    for r in records:
        pred = predict_sanitation_status(
            water_quality_index=r.water_quality_index,
            ph_level=r.ph_level,
            dissolved_oxygen=r.dissolved_oxygen
        )
        if r.sanitation_status != pred:
            r.sanitation_status = pred
            db.add(r)
    db.commit()
    return records


@router.get("/{record_id}", response_model=CleanlinessResponse)
def get_cleanliness(record_id: int, db: Session = Depends(get_db)):
    record = db.query(Cleanliness).filter(Cleanliness.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Cleanliness record not found")
    return record


@router.put("/{record_id}", response_model=CleanlinessResponse)
def update_cleanliness(record_id: int, data: CleanlinessUpdate, db: Session = Depends(get_db)):
    record = db.query(Cleanliness).filter(Cleanliness.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Cleanliness record not found")
    data_dict = data.model_dump()
    # Auto-predict sanitation status from updated water quality parameters
    data_dict["sanitation_status"] = predict_sanitation_status(
        water_quality_index=data_dict["water_quality_index"],
        ph_level=data_dict["ph_level"],
        dissolved_oxygen=data_dict["dissolved_oxygen"]
    )
    for key, value in data_dict.items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}")
def delete_cleanliness(record_id: int, db: Session = Depends(get_db)):
    record = db.query(Cleanliness).filter(Cleanliness.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Cleanliness record not found")
    db.delete(record)
    db.commit()
    return {"message": "Cleanliness record deleted successfully"}
