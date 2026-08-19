from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.sadhu_gram import SadhuGram
from app.schemas.sadhu_gram_schema import SadhuGramCreate, SadhuGramUpdate, SadhuGramResponse

router = APIRouter(
    prefix="/sadhu-gram",
    tags=["Sadhu Gram Management"]
)


@router.post("/", response_model=SadhuGramResponse)
def create_sadhu_gram(record: SadhuGramCreate, db: Session = Depends(get_db)):
    new_record = SadhuGram(**record.model_dump())
    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    return new_record


@router.get("/", response_model=list[SadhuGramResponse])
def get_all_sadhu_gram(db: Session = Depends(get_db)):
    return db.query(SadhuGram).all()


@router.get("/{record_id}", response_model=SadhuGramResponse)
def get_sadhu_gram(record_id: int, db: Session = Depends(get_db)):
    record = db.query(SadhuGram).filter(SadhuGram.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Sadhu Gram record not found")
    return record


@router.put("/{record_id}", response_model=SadhuGramResponse)
def update_sadhu_gram(record_id: int, data: SadhuGramUpdate, db: Session = Depends(get_db)):
    record = db.query(SadhuGram).filter(SadhuGram.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Sadhu Gram record not found")
    for key, value in data.model_dump().items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record


@router.delete("/{record_id}")
def delete_sadhu_gram(record_id: int, db: Session = Depends(get_db)):
    record = db.query(SadhuGram).filter(SadhuGram.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Sadhu Gram record not found")
    db.delete(record)
    db.commit()
    return {"message": "Sadhu Gram record deleted successfully"}
