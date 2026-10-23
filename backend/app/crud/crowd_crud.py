from sqlalchemy.orm import Session

from app.models.crowd import Crowd
from app.schemas.crowd_schema import CrowdCreate
from app.ml.prediction import predict_risk


def create_crowd(db: Session, crowd: CrowdCreate):

    # ML auto-predicts risk level based on visitor counts
    predicted_risk = predict_risk(
        previous_visitors=crowd.expected_visitors,
        current_visitors=crowd.actual_visitors
    )

    new_record = Crowd(

        date=crowd.date,

        location=crowd.location,

        expected_visitors=crowd.expected_visitors,

        actual_visitors=crowd.actual_visitors,

        risk_level=predicted_risk  # ML-predicted, not manually entered

    )

    db.add(new_record)

    db.commit()

    db.refresh(new_record)

    return new_record


def get_all_records(db: Session):

    return db.query(Crowd).all()