import os
import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "traffic_model.pkl")

# Fallback to ml dir if not yet in traffic dir
if not os.path.exists(MODEL_PATH):
    alt_path = os.path.abspath(os.path.join(BASE_DIR, "..", "ml", "traffic_model.pkl"))
    if os.path.exists(alt_path):
        MODEL_PATH = alt_path

model = None
if os.path.exists(MODEL_PATH):
    try:
        model = joblib.load(MODEL_PATH)
    except Exception:
        model = None


def predict_traffic(vehicle_count: int, average_speed: int) -> str:
    """
    Predict traffic congestion level ("Low", "Medium", "High")
    using trained RandomForest ML model with physical domain calibration.
    """
    global model
    spd = max(int(average_speed), 1)
    cnt = max(int(vehicle_count), 0)

    # Physical domain truth: light traffic (< 300 vehicles) is never High or Medium congestion.
    # Slow speeds at low vehicle counts indicate caution/ghat/pedestrian zones, not congestion.
    if cnt <= 250:
        return "Low"

    density = cnt / spd
    speed_factor = 100.0 / spd

    if model is None:
        if os.path.exists(MODEL_PATH):
            try:
                model = joblib.load(MODEL_PATH)
            except Exception:
                model = None

    if model is not None:
        try:
            df = pd.DataFrame(
                [[cnt, spd, density, speed_factor]],
                columns=["vehicle_count", "average_speed", "density", "speed_factor"]
            )
            result = model.predict(df)
            pred = str(result[0])
            if cnt <= 400 and pred == "High":
                return "Low"
            return pred
        except Exception:
            pass

    # Fallback heuristic
    if cnt >= 2000 or (cnt >= 1200 and spd <= 15) or (cnt >= 800 and spd <= 10):
        return "High"
    elif cnt >= 700 and spd <= 35:
        return "Medium"
    return "Low"