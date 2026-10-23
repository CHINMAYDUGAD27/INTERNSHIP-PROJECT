import os
import joblib


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


model = joblib.load(
    os.path.join(BASE_DIR, "crowd_model.pkl")
)


def predict_risk(previous_visitors, current_visitors):
    """
    Predict crowd risk level using ML model.

    Uses 4 features:
      - expected_visitors (previous_visitors)
      - actual_visitors   (current_visitors)
      - ratio             = actual / expected  (key: catches 100→1000 as High)
      - overflow          = actual - expected

    Returns: "Low", "Medium", or "High"
    """
    expected = previous_visitors
    actual = current_visitors

    ratio = actual / expected if expected > 0 else float(actual)
    overflow = actual - expected

    prediction = model.predict(
        [
            [expected, actual, ratio, overflow]
        ]
    )

    return prediction[0]