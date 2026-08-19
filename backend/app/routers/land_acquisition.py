from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.land_acquisition import LandAcquisition
from app.schemas.land_acquisition_schema import LandAcquisitionCreate, LandAcquisitionUpdate, LandAcquisitionResponse

router = APIRouter(
    prefix="/land-acquisition",
    tags=["Land Acquisition"]
)


@router.post("/", response_model=LandAcquisitionResponse)
def create_land_acquisition(record: LandAcquisitionCreate, db: Session = Depends(get_db)):
    new_record = LandAcquisition(**record.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.get("/", response_model=list[LandAcquisitionResponse])
def get_all_land_acquisition(db: Session = Depends(get_db)):
    return db.query(LandAcquisition).all()


@router.get("/{record_id}", response_model=LandAcquisitionResponse)
def get_land_acquisition(record_id: int, db: Session = Depends(get_db)):
    record = db.query(LandAcquisition).filter(LandAcquisition.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Land Acquisition record not found")
    return record


@router.put("/{record_id}", response_model=LandAcquisitionResponse)
def update_land_acquisition(record_id: int, data: LandAcquisitionUpdate, db: Session = Depends(get_db)):
    record = db.query(LandAcquisition).filter(LandAcquisition.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Land Acquisition record not found")
    for key, value in data.model_dump().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}")
def delete_land_acquisition(record_id: int, db: Session = Depends(get_db)):
    record = db.query(LandAcquisition).filter(LandAcquisition.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Land Acquisition record not found")
    db.delete(record)
    db.commit()
    return {"message": "Land Acquisition record deleted successfully"}
