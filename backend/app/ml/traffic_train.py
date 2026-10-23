import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TRAFFIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "traffic"))

# Load dataset
data = pd.read_csv(os.path.join(BASE_DIR, "traffic_dataset.csv"))

# Feature engineering:
# Density = vehicles / speed. Higher density = slower crawling traffic.
# Speed factor = inverse speed to penalize bottlenecks.
data["density"] = data["vehicle_count"] / data["average_speed"].clip(lower=1)
data["speed_factor"] = 100.0 / data["average_speed"].clip(lower=1)

X = data[["vehicle_count", "average_speed", "density", "speed_factor"]]
y = data["congestion"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

score = model.score(X_test, y_test)
print(f"Traffic Model accuracy on test set: {score * 100:.1f}%")

# Save model to app/ml and app/traffic
ml_model_path = os.path.join(BASE_DIR, "traffic_model.pkl")
traffic_model_path = os.path.join(TRAFFIC_DIR, "traffic_model.pkl")

joblib.dump(model, ml_model_path)
if os.path.exists(TRAFFIC_DIR):
    joblib.dump(model, traffic_model_path)

print(f"Traffic model saved to {ml_model_path}")

# Test verification
test_cases = [
    (200, 50),   # Low
    (1500, 28),  # Medium
    (3000, 10),  # High
    (400, 8),    # Bottleneck crawling -> High
    (500, 45),   # Fast moving -> Low
]

print("\nVerification Test Cases:")
for vc, spd in test_cases:
    d = vc / max(spd, 1)
    sf = 100.0 / max(spd, 1)
    pred = model.predict([[vc, spd, d, sf]])[0]
    print(f"  vehicles={vc:>5} speed={spd:>2} km/h => {pred}")
