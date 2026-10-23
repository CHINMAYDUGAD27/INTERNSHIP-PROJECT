import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ML_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "ml"))

data = pd.read_csv(os.path.join(BASE_DIR, "traffic_dataset.csv"))

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

model_path = os.path.join(BASE_DIR, "traffic_model.pkl")
joblib.dump(model, model_path)
if os.path.exists(ML_DIR):
    joblib.dump(model, os.path.join(ML_DIR, "traffic_model.pkl"))

print(f"Traffic model saved to {model_path}")