from sqlalchemy.orm import Session

from app.models.crowd import Crowd
from app.schemas.crowd_schema import CrowdCreate


def create_crowd(db: Session, crowd: CrowdCreate):

    new_record = Crowd(

        date=crowd.date,

        location=crowd.location,

        expected_visitors=crowd.expected_visitors,

        actual_visitors=crowd.actual_visitors,

        risk_level=crowd.risk_level

    )

    db.add(new_record)

    db.commit()

    db.refresh(new_record)

    return new_record


def get_all_records(db: Session):

    return db.query(Crowd).all()