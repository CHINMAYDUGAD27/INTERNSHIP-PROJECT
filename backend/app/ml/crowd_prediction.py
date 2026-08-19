import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL = joblib.load(
    os.path.join(BASE_DIR, "models", "crowd_model.pkl")
)

ENCODERS = joblib.load(
    os.path.join(BASE_DIR, "models", "crowd_encoders.pkl")
)


def predict_crowd(
    day_of_week,
    month,
    location,
    event_type,
    weather,
    temperature
):

    data = {
        "day_of_week": day_of_week,
        "month": month,
        "location": location,
        "event_type": event_type,
        "weather": weather,
        "temperature": temperature
    }

    df = pd.DataFrame([data])

    for column in ENCODERS:
        df[column] = ENCODERS[column].transform(df[column])

    prediction = MODEL.predict(df)

    return int(prediction[0])