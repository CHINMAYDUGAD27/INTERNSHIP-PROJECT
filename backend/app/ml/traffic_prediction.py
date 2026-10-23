import os
import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "traffic_model.pkl")

# Fallback to traffic dir if not yet in ml dir
if not os.path.exists(MODEL_PATH):
    alt_path = os.path.abspath(os.path.join(BASE_DIR, "..", "traffic", "traffic_model.pkl"))
    if os.path.exists(alt_path):
        MODEL_PATH = alt_path

model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)


def predict_traffic(vehicle_count: int, average_speed: int) -> str:
    """
    Predict traffic congestion level ("Low", "Medium", "High")
    using trained RandomForest ML model.
    """
    global model
    spd = max(int(average_speed), 1)
    cnt = max(int(vehicle_count), 0)
    density = cnt / spd
    speed_factor = 100.0 / spd

    if model is None:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
        else:
            if spd <= 15 or cnt >= 2500:
                return "High"
            elif spd <= 30 or cnt >= 1200:
                return "Medium"
            return "Low"

    df = pd.DataFrame(
        [[cnt, spd, density, speed_factor]],
        columns=["vehicle_count", "average_speed", "density", "speed_factor"]
    )

    result = model.predict(df)
    return str(result[0])
