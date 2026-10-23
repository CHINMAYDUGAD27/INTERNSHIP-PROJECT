import os
import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "cleanliness_model.pkl")

model = None
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
    except Exception:
        model = None


def predict_sanitation_status(
    water_quality_index: float,
    ph_level: float,
    dissolved_oxygen: float
) -> str:
    """
    Predict river Godavari ghat sanitation status ("Clean", "Needs Attention", "Critical")
    using trained RandomForest ML model with environmental domain heuristics.
    """
    global model
    wqi = float(water_quality_index)
    ph = float(ph_level)
    do = float(dissolved_oxygen)

    ph_dev = abs(ph - 7.0)
    do_def = max(8.0 - do, 0)

    if model is None:
        if os.path.exists(MODEL_PATH):
            try:
                model = joblib.load(MODEL_PATH)
            except Exception:
                model = None

    if model is not None:
        try:
            df = pd.DataFrame(
                [[wqi, ph, do, ph_dev, do_def]],
                columns=["water_quality_index", "ph_level", "dissolved_oxygen", "ph_deviation", "do_deficit"]
            )
            result = model.predict(df)
            return str(result[0])
        except Exception:
            pass

    # Fallback domain logic based on CPCB bathing standards
    if wqi < 45.0 or ph < 6.0 or ph > 9.0 or do < 3.5:
        return "Critical"
    elif wqi < 70.0 or ph < 6.5 or ph > 8.5 or do < 5.0:
        return "Needs Attention"
    return "Clean"
