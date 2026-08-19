from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.cleanliness import Cleanliness
from app.schemas.cleanliness_schema import CleanlinessCreate, CleanlinessUpdate, CleanlinessResponse

router = APIRouter(
    prefix="/cleanliness",
    tags=["Cleanliness & River Godavari"]
)


@router.post("/", response_model=CleanlinessResponse)
def create_cleanliness(record: CleanlinessCreate, db: Session = Depends(get_db)):
    new_record = Cleanliness(**record.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.get("/", response_model=list[CleanlinessResponse])
def get_all_cleanliness(db: Session = Depends(get_db)):
    return db.query(Cleanliness).all()


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
    for key, value in data.model_dump().items():
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
