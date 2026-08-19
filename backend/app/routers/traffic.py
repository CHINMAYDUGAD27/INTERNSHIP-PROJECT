from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.traffic import Traffic
from app.traffic.traffic_prediction import predict_traffic
from app.ai.traffic_ai import analyze_traffic


router = APIRouter(
    prefix="/traffic",
    tags=["Traffic Management"]
)


# Create Traffic Record
@router.post("/")
def create_traffic(
    location: str,
    road_name: str,
    vehicle_count: int,
    average_speed: int,
    weather_condition: str,
    event_type: str,
    db: Session = Depends(get_db)
):

    traffic = Traffic(
        location=location,
        road_name=road_name,
        vehicle_count=vehicle_count,
        average_speed=average_speed,
        weather_condition=weather_condition,
        event_type=event_type
    )

    db.add(traffic)
    db.commit()
    db.refresh(traffic)

    return {
        "message": "Traffic data added successfully",
        "data": traffic
    }



# Get All Traffic Records
@router.get("/")
def get_traffic(
    db: Session = Depends(get_db)
):

    traffic_data = db.query(Traffic).all()

    return traffic_data

@router.get("/predict/{traffic_id}")
def predict_traffic_level(
    traffic_id: int,
    db: Session = Depends(get_db)
):

    traffic = db.query(Traffic).filter(
        Traffic.id == traffic_id
    ).first()


    if not traffic:
        raise HTTPException(
            status_code=404,
            detail="Traffic record not found"
        )


    prediction = predict_traffic(
        traffic.vehicle_count,
        traffic.average_speed
    )


    return {
        "traffic_data": {
            "location": traffic.location,
            "road_name": traffic.road_name,
            "vehicle_count": traffic.vehicle_count,
            "average_speed": traffic.average_speed,
            "event_type": traffic.event_type
        },

        "ml_prediction": {
            "congestion_level": prediction
        }
    }

@router.get("/smart-analysis/{traffic_id}")
def smart_traffic_analysis(
    traffic_id:int,
    db:Session = Depends(get_db)
):

    traffic = db.query(Traffic).filter(
        Traffic.id == traffic_id
    ).first()


    if not traffic:
        raise HTTPException(
            status_code=404,
            detail="Traffic record not found"
        )


    # ML Prediction

    congestion = predict_traffic(
        traffic.vehicle_count,
        traffic.average_speed
    )


    # Groq AI Recommendation

    recommendation = analyze_traffic(
        traffic.location,
        traffic.road_name,
        traffic.vehicle_count,
        traffic.average_speed,
        congestion
    )


    return {

        "traffic_data":{
            "location":traffic.location,
            "road_name":traffic.road_name,
            "vehicle_count":traffic.vehicle_count,
            "average_speed":traffic.average_speed
        },


        "ml_prediction":{
            "congestion_level":congestion
        },


        "ai_recommendation":recommendation

    }