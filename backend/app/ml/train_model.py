import os
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier


BASE_DIR = os.path.dirname(os.path.abspath(__file__))


# Load dataset
data = pd.read_csv(
    os.path.join(BASE_DIR, "crowd_dataset.csv")
)


# Input features
X = data[
    [
        "previous_visitors",
        "current_visitors"
    ]
]


# Output
y = data["risk"]


# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# Create model
model = RandomForestClassifier()


# Train model
model.fit(
    X_train,
    y_train
)


# Save model
joblib.dump(
    model,
    os.path.join(BASE_DIR, "crowd_model.pkl")
)


print("Model trained successfully")