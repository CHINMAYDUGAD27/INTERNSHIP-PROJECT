import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load dataset
data = pd.read_csv(os.path.join(BASE_DIR, "cleanliness_dataset.csv"))

# Feature engineering:
# pH neutral deviation (distance from ideal 7.0)
data["ph_deviation"] = (data["ph_level"] - 7.0).abs()
# Oxygen deficit from saturation baseline (approx 8.0 mg/L)
data["do_deficit"] = (8.0 - data["dissolved_oxygen"]).clip(lower=0)

features = ["water_quality_index", "ph_level", "dissolved_oxygen", "ph_deviation", "do_deficit"]
X = data[features]
y = data["sanitation_status"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

score = model.score(X_test, y_test)
print(f"Cleanliness Model accuracy on test set: {score * 100:.1f}%")

# Save model
model_path = os.path.join(BASE_DIR, "cleanliness_model.pkl")
joblib.dump(model, model_path)
print(f"Cleanliness model saved to {model_path}")

# Verification tests
test_cases = [
    (85.0, 7.2, 6.8),  # Clean
    (60.0, 6.3, 4.2),  # Needs Attention
    (30.0, 5.4, 2.1),  # Critical
    (75.0, 7.1, 6.0),  # Clean
    (42.0, 9.3, 3.2),  # Critical
]

print("\nVerification Test Cases:")
for wqi, ph, do in test_cases:
    ph_dev = abs(ph - 7.0)
    do_def = max(8.0 - do, 0)
    pred = model.predict([[wqi, ph, do, ph_dev, do_def]])[0]
    print(f"  WQI={wqi:>4.1f} pH={ph:>4.1f} DO={do:>4.1f} mg/L => {pred}")
