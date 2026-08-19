from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.safety import Safety
from app.schemas.safety_schema import SafetyCreate, SafetyUpdate, SafetyResponse

router = APIRouter(
    prefix="/safety",
    tags=["Safety & Public Control"]
)


@router.post("/", response_model=SafetyResponse)
def create_safety(record: SafetyCreate, db: Session = Depends(get_db)):
    new_record = Safety(**record.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.get("/", response_model=list[SafetyResponse])
def get_all_safety(db: Session = Depends(get_db)):
    return db.query(Safety).all()


@router.get("/{record_id}", response_model=SafetyResponse)
def get_safety(record_id: int, db: Session = Depends(get_db)):
    record = db.query(Safety).filter(Safety.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Safety record not found")
    return record


@router.put("/{record_id}", response_model=SafetyResponse)
def update_safety(record_id: int, data: SafetyUpdate, db: Session = Depends(get_db)):
    record = db.query(Safety).filter(Safety.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Safety record not found")
    for key, value in data.model_dump().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}")
def delete_safety(record_id: int, db: Session = Depends(get_db)):
    record = db.query(Safety).filter(Safety.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Safety record not found")
    db.delete(record)
    db.commit()
    return {"message": "Safety record deleted successfully"}
