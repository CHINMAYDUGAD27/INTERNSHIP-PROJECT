import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "ml"))

data = pd.read_csv(os.path.join(BASE_DIR, "medical_dataset.csv"))

data["patient_doctor_ratio"] = data["actual_patients"] / data["available_doctors"].clip(lower=1)
data["patient_nurse_ratio"] = data["actual_patients"] / data["available_nurses"].clip(lower=1)
data["patient_surge_ratio"] = data["actual_patients"] / data["expected_patients"].clip(lower=1)
data["patient_ambulance_ratio"] = data["actual_patients"] / data["available_ambulances"].clip(lower=1)

features = [
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

X = data[features]
y = data["emergency_level"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

score = model.score(X_test, y_test)
print(f"Medical Model accuracy on test set: {score * 100:.1f}%")

model_path = os.path.join(BASE_DIR, "medical_model.pkl")
joblib.dump(model, model_path)
if os.path.exists(ML_DIR):
    joblib.dump(model, os.path.join(ML_DIR, "medical_model.pkl"))

print(f"Medical model saved to {model_path}")
