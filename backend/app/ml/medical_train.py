import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MEDICAL_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "medical"))

# Load dataset
data = pd.read_csv(os.path.join(BASE_DIR, "medical_dataset.csv"))

# Engineered features
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

# Save model
ml_model_path = os.path.join(BASE_DIR, "medical_model.pkl")
medical_model_path = os.path.join(MEDICAL_DIR, "medical_model.pkl")

joblib.dump(model, ml_model_path)
if os.path.exists(MEDICAL_DIR):
    joblib.dump(model, medical_model_path)

print(f"Medical model saved to {ml_model_path}")

# Verification tests
test_cases = [
    (10, 20, 5, 100, 90),    # Doctors well-equipped, under expected -> Normal
    (10, 20, 4, 100, 180),   # 1.8x surge -> High
    (5, 10, 1, 50, 300),     # 6x surge, only 1 ambulance -> Critical
    (25, 50, 10, 250, 230),  # Big camp within capacity -> Normal
    (25, 50, 8, 250, 450),   # High strain -> High
    (2, 4, 1, 20, 100),      # Tiny post overwhelmed -> Critical
]

print("\nVerification Test Cases:")
for docs, nurses, amb, exp, act in test_cases:
    pdr = act / max(docs, 1)
    pnr = act / max(nurses, 1)
    psr = act / max(exp, 1)
    par = act / max(amb, 1)
    pred = model.predict([[docs, nurses, amb, exp, act, pdr, pnr, psr, par]])[0]
    print(f"  Docs={docs:>2} Amb={amb:>2} Exp={exp:>4} Act={act:>4} (Surge={psr:.1f}x) => {pred}")
