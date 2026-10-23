import os
import joblib
import pandas as pd


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "medical_model.pkl")

# Check fallback to app/medical
if not os.path.exists(MODEL_PATH):
    alt_path = os.path.abspath(os.path.join(BASE_DIR, "..", "medical", "medical_model.pkl"))
    if os.path.exists(alt_path):
        MODEL_PATH = alt_path

model = None
if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)


def predict_emergency_level(
    available_doctors: int,
    available_nurses: int,
    available_ambulances: int,
    expected_patients: int,
    actual_patients: int
) -> str:
    """
    Predict medical emergency level ("Normal", "High", "Critical")
    using trained RandomForest ML model.
    """
    global model
    docs = max(int(available_doctors), 1)
    nurses = max(int(available_nurses), 1)
    amb = max(int(available_ambulances), 1)
    exp = max(int(expected_patients), 1)
    act = max(int(actual_patients), 0)

    pdr = act / docs
    pnr = act / nurses
    psr = act / exp
    par = act / amb

    if model is None:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
        else:
            if pdr > 35 or psr >= 2.0 or (act > 100 and amb <= 1):
                return "Critical"
            elif pdr > 15 or psr >= 1.25:
                return "High"
            return "Normal"

    feature_cols = [
        "available_doctors",
        "available_nurses",
        "available_ambulances",
        "expected_patients",
        "actual_patients",
        "patient_doctor_ratio",
        "patient_nurse_ratio",
        "patient_surge_ratio",
        "patient_ambulance_ratio"
    ]
    df = pd.DataFrame([[docs, nurses, amb, exp, act, pdr, pnr, psr, par]], columns=feature_cols)

    result = model.predict(df)
    return str(result[0])
