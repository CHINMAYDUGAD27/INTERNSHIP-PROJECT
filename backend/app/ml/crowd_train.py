import os
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "..",
    "datasets",
    "kumbh_master_dataset.csv"
)

MODEL_DIR = os.path.join(
    BASE_DIR,
    "models"
)

os.makedirs(MODEL_DIR, exist_ok=True)

data = pd.read_csv(DATASET_PATH)

encoders = {}

categorical_columns = [
    "day_of_week",
    "month",
    "location",
    "event_type",
    "weather"
]

for column in categorical_columns:
    encoder = LabelEncoder()
    data[column] = encoder.fit_transform(data[column])
    encoders[column] = encoder

X = data[
    [
        "day_of_week",
        "month",
        "location",
        "event_type",
        "weather",
        "temperature"
    ]
]

y = data["actual_visitors"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

model = RandomForestRegressor(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

joblib.dump(
    model,
    os.path.join(
        MODEL_DIR,
        "crowd_model.pkl"
    )
)

joblib.dump(
    encoders,
    os.path.join(
        MODEL_DIR,
        "crowd_encoders.pkl"
    )
)

print("Crowd model trained successfully.")