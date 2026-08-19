from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def home():
    return {
        "project": "AI Smart Kumbh Mela DSS",
        "version": "1.0",
        "status": "Running Successfully"
    }


@router.get("/health")
def health():
    return {
        "status": "Healthy"
    }