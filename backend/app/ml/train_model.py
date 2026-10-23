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


# Add ratio feature — key insight:
# Risk depends on HOW MUCH actual exceeds expected, not raw numbers.
# expected=100, actual=1000 (ratio=10) should be HIGH
# expected=100000, actual=110000 (ratio=1.1) should be LOW
data["ratio"] = data["actual_visitors"] / data["expected_visitors"].replace(0, 1)
data["overflow"] = data["actual_visitors"] - data["expected_visitors"]


# Input features
X = data[
    [
        "expected_visitors",
        "actual_visitors",
        "ratio",
        "overflow"
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


# Create and train model
model = RandomForestClassifier(n_estimators=100, random_state=42)

model.fit(
    X_train,
    y_train
)

# Evaluate
score = model.score(X_test, y_test)
print(f"Model accuracy on test set: {score * 100:.1f}%")


# Save model
joblib.dump(
    model,
    os.path.join(BASE_DIR, "crowd_model.pkl")
)


print("Model trained and saved successfully.")
print("\nTest predictions:")
test_cases = [
    (100, 1000),    # 10x overcrowding → should be High
    (100, 130),     # 1.3x → should be Medium
    (100, 90),      # under capacity → should be Low
    (150000, 220000),  # classic High
    (50000, 60000),    # classic Low
    (70000, 90000),    # classic Medium
]
for exp, act in test_cases:
    ratio = act / exp
    overflow = act - exp
    pred = model.predict([[exp, act, ratio, overflow]])[0]
    print(f"  expected={exp:>8,} actual={act:>8,} ratio={ratio:.2f} => {pred}")