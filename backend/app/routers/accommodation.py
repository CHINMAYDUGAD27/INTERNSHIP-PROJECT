from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.accommodation import Accommodation
from app.schemas.accommodation_schema import AccommodationCreate, AccommodationUpdate, AccommodationResponse

router = APIRouter(
    prefix="/accommodation",
    tags=["Accommodation & Darshan"]
)


@router.post("/", response_model=AccommodationResponse)
def create_accommodation(record: AccommodationCreate, db: Session = Depends(get_db)):
    new_record = Accommodation(**record.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.get("/", response_model=list[AccommodationResponse])
def get_all_accommodation(db: Session = Depends(get_db)):
    return db.query(Accommodation).all()


@router.get("/{record_id}", response_model=AccommodationResponse)
def get_accommodation(record_id: int, db: Session = Depends(get_db)):
    record = db.query(Accommodation).filter(Accommodation.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Accommodation record not found")
    return record


@router.put("/{record_id}", response_model=AccommodationResponse)
def update_accommodation(record_id: int, data: AccommodationUpdate, db: Session = Depends(get_db)):
    record = db.query(Accommodation).filter(Accommodation.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Accommodation record not found")
    for key, value in data.model_dump().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}")
def delete_accommodation(record_id: int, db: Session = Depends(get_db)):
    record = db.query(Accommodation).filter(Accommodation.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Accommodation record not found")
    db.delete(record)
    db.commit()
    return {"message": "Accommodation record deleted successfully"}
