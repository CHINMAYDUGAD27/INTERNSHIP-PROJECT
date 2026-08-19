import os
import joblib


BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


model = joblib.load(
    os.path.join(
        BASE_DIR,
        "traffic_model.pkl"
    )
)


def predict_traffic(
    vehicle_count,
    average_speed
):

    result = model.predict(
        [
            [
                vehicle_count,
                average_speed
            ]
        ]
    )

    return result[0]