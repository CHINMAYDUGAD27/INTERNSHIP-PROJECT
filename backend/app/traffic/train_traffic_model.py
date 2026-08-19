import os
import pandas as pd
import joblib

from sklearn.ensemble import RandomForestClassifier


BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)


data = pd.read_csv(
    os.path.join(
        BASE_DIR,
        "traffic_dataset.csv"
    )
)


X = data[
[
"vehicle_count",
"average_speed"
]
]


y = data["congestion"]


model = RandomForestClassifier()


model.fit(
    X,
    y
)


joblib.dump(
    model,
    os.path.join(
        BASE_DIR,
        "traffic_model.pkl"
    )
)


print(
"Traffic model trained successfully"
)