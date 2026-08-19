import os
import joblib


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


model = joblib.load(
    os.path.join(BASE_DIR, "crowd_model.pkl")
)


def predict_risk(previous_visitors, current_visitors):

    prediction = model.predict(
        [
            [
                previous_visitors,
                current_visitors
            ]
        ]
    )

    return prediction[0]