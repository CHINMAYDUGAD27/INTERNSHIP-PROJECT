import csv
import random
from datetime import datetime, timedelta

# ==========================================================
# AI-Powered Smart Kumbh Mela DSS
# Master Dataset Generator
# Generates realistic synthetic data for:
# Crowd
# Traffic
# Medical
# Police
# Volunteers
# Parking
# Cleanliness
# River Monitoring
# ==========================================================

NUMBER_OF_RECORDS = 1000

START_DATE = datetime(2027, 7, 1)

LOCATIONS = [
    "Ramkund",
    "Trimbakeshwar Temple",
    "Sadhugram",
    "Tapovan",
    "Panchavati",
    "Godavari Ghat",
    "Mumbai Naka",
    "CBS Nashik",
    "Adgaon Naka",
    "Gangapur Road",
    "Mhasrul",
    "Nimani",
    "Dwarka Circle",
    "Shalimar",
    "College Road"
]

EVENT_TYPES = [
    "Normal Day",
    "Weekend",
    "Festival",
    "Shahi Snan"
]

WEATHER_TYPES = [
    "Sunny",
    "Cloudy",
    "Rainy"
]

RIVER_LEVELS = [
    "Low",
    "Normal",
    "High"
]

CROWD_LEVELS = [
    "Low",
    "Medium",
    "High"
]

CONGESTION_LEVELS = [
    "Low",
    "Medium",
    "High"
]

EMERGENCY_LEVELS = [
    "Low",
    "Medium",
    "High",
    "Critical"
]

HEADERS = [

    "date",
    "day_of_week",
    "month",

    "location",

    "event_type",

    "weather",

    "temperature",

    "expected_visitors",

    "actual_visitors",

    "vehicle_count",

    "average_speed",

    "available_doctors",

    "available_nurses",

    "available_ambulances",

    "police_personnel",

    "volunteers",

    "medical_cases",

    "parking_occupancy",

    "river_water_level",

    "cleanliness_score",

    "crowd_density",

    "congestion_level",

    "emergency_level"

]

# ==========================================================
# Helper Functions
# ==========================================================

def random_date(index):
    return START_DATE + timedelta(days=index % 120)


def choose_event(date):

    # Sunday = Weekend
    if date.weekday() == 6:
        return "Weekend"

    # Every 25th day simulate Shahi Snan
    if date.day in [5, 15, 25]:
        return "Shahi Snan"

    # Every 10th day simulate Festival
    if date.day in [10, 20, 30]:
        return "Festival"

    return "Normal Day"


def choose_weather():

    return random.choices(

        WEATHER_TYPES,

        weights=[60, 25, 15],

        k=1

    )[0]


def visitor_range(event):

    if event == "Shahi Snan":
        return random.randint(300000, 800000)

    elif event == "Festival":
        return random.randint(120000, 250000)

    elif event == "Weekend":
        return random.randint(70000, 140000)

    else:
        return random.randint(15000, 70000)


def calculate_actual_visitors(expected):

    variation = random.uniform(0.90, 1.12)

    return int(expected * variation)


def calculate_vehicle_count(actual):

    ratio = random.uniform(0.12, 0.20)

    return int(actual * ratio)


def calculate_speed(vehicle_count):

    if vehicle_count > 100000:
        return random.randint(5, 10)

    elif vehicle_count > 50000:
        return random.randint(10, 18)

    elif vehicle_count > 25000:
        return random.randint(18, 28)

    else:
        return random.randint(28, 45)


def calculate_doctors(actual):

    return max(10, actual // 7000)


def calculate_nurses(doctors):

    return doctors * 2 + random.randint(0, 15)


def calculate_ambulances(actual):

    return max(3, actual // 25000)


def calculate_police(actual):

    return max(80, actual // 300)


def calculate_volunteers(actual):

    return max(120, actual // 180)

# ==========================================================
# Smart Rule Engine
# ==========================================================

def calculate_medical_cases(actual_visitors, weather):

    # Base percentage of visitors requiring medical attention
    ratio = random.uniform(0.0025, 0.0065)

    cases = int(actual_visitors * ratio)

    if weather == "Rainy":
        cases += random.randint(30, 150)

    return cases


def calculate_parking(vehicle_count):

    occupancy = int((vehicle_count / 120000) * 100)

    occupancy = max(10, occupancy)

    occupancy = min(100, occupancy)

    return occupancy


def calculate_river_level(weather, event):

    if event == "Shahi Snan":
        return "High"

    if weather == "Rainy":
        return random.choice(["Normal", "High"])

    return random.choice(["Low", "Normal"])


def calculate_cleanliness(actual_visitors):

    score = 100 - (actual_visitors / 12000)

    score += random.randint(-4, 4)

    score = max(40, min(100, int(score)))

    return score


def calculate_crowd_density(actual_visitors):

    if actual_visitors >= 300000:
        return "High"

    elif actual_visitors >= 100000:
        return "Medium"

    else:
        return "Low"


def calculate_congestion(vehicle_count, average_speed):

    if vehicle_count > 90000 or average_speed <= 10:
        return "High"

    elif vehicle_count > 35000 or average_speed <= 20:
        return "Medium"

    else:
        return "Low"


def calculate_emergency(
    medical_cases,
    actual_visitors,
    congestion
):

    if (
        medical_cases > 1800
        or actual_visitors > 500000
        or congestion == "High"
    ):
        return "Critical"

    elif (
        medical_cases > 900
        or actual_visitors > 250000
    ):
        return "High"

    elif (
        medical_cases > 300
        or actual_visitors > 80000
    ):
        return "Medium"

    return "Low"

# ==========================================================
# Generate One Complete Record
# ==========================================================

def generate_record(index):

    current_date = random_date(index)

    date = current_date.strftime("%Y-%m-%d")

    day_of_week = current_date.strftime("%A")

    month = current_date.strftime("%B")

    location = random.choice(LOCATIONS)

    event_type = choose_event(current_date)

    weather = choose_weather()

    if weather == "Sunny":
        temperature = random.randint(30, 38)

    elif weather == "Cloudy":
        temperature = random.randint(25, 32)

    else:
        temperature = random.randint(22, 29)

    expected_visitors = visitor_range(event_type)

    actual_visitors = calculate_actual_visitors(
        expected_visitors
    )

    vehicle_count = calculate_vehicle_count(
        actual_visitors
    )

    average_speed = calculate_speed(
        vehicle_count
    )

    available_doctors = calculate_doctors(
        actual_visitors
    )

    available_nurses = calculate_nurses(
        available_doctors
    )

    available_ambulances = calculate_ambulances(
        actual_visitors
    )

    police_personnel = calculate_police(
        actual_visitors
    )

    volunteers = calculate_volunteers(
        actual_visitors
    )

    medical_cases = calculate_medical_cases(
        actual_visitors,
        weather
    )

    parking_occupancy = calculate_parking(
        vehicle_count
    )

    river_water_level = calculate_river_level(
        weather,
        event_type
    )

    cleanliness_score = calculate_cleanliness(
        actual_visitors
    )

    crowd_density = calculate_crowd_density(
        actual_visitors
    )

    congestion_level = calculate_congestion(
        vehicle_count,
        average_speed
    )

    emergency_level = calculate_emergency(
        medical_cases,
        actual_visitors,
        congestion_level
    )

    return [

        date,

        day_of_week,

        month,

        location,

        event_type,

        weather,

        temperature,

        expected_visitors,

        actual_visitors,

        vehicle_count,

        average_speed,

        available_doctors,

        available_nurses,

        available_ambulances,

        police_personnel,

        volunteers,

        medical_cases,

        parking_occupancy,

        river_water_level,

        cleanliness_score,

        crowd_density,

        congestion_level,

        emergency_level

    ]

# ==========================================================
# Generate Complete Dataset
# ==========================================================

def generate_dataset():

    with open(
        "app/datasets/kumbh_master_dataset.csv",
        mode="w",
        newline="",
        encoding="utf-8"
    ) as file:

        writer = csv.writer(file)

        # Write CSV Header
        writer.writerow(HEADERS)

        # Generate Records
        for index in range(NUMBER_OF_RECORDS):

            record = generate_record(index)

            writer.writerow(record)

    print("=" * 60)
    print("AI-Powered Smart Kumbh Mela DSS")
    print("Master Dataset Generated Successfully")
    print(f"Total Records : {NUMBER_OF_RECORDS}")
    print("Location      : app/datasets/kumbh_master_dataset.csv")
    print("=" * 60)

# ==========================================================
# Location-Based Crowd Multipliers
# ==========================================================

LOCATION_MULTIPLIERS = {

    "Ramkund": 1.60,
    "Trimbakeshwar Temple": 1.80,
    "Godavari Ghat": 1.45,
    "Sadhugram": 1.35,
    "Tapovan": 1.25,

    "Panchavati": 1.15,
    "CBS Nashik": 1.10,
    "Mumbai Naka": 1.05,

    "Gangapur Road": 0.90,
    "Adgaon Naka": 0.85,
    "Mhasrul": 0.80,
    "Nimani": 0.95,
    "Dwarka Circle": 1.00,
    "Shalimar": 1.05,
    "College Road": 0.75

}


def adjust_visitors_by_location(location, visitors):

    multiplier = LOCATION_MULTIPLIERS.get(location, 1.0)

    return int(visitors * multiplier)


# ==========================================================
# Override generate_record with improved logic
# ==========================================================

_original_generate_record = generate_record


def generate_record(index):

    row = _original_generate_record(index)

    location = row[3]

    expected_visitors = adjust_visitors_by_location(
        location,
        row[7]
    )

    actual_visitors = calculate_actual_visitors(
        expected_visitors
    )

    vehicle_count = calculate_vehicle_count(
        actual_visitors
    )

    average_speed = calculate_speed(
        vehicle_count
    )

    doctors = calculate_doctors(
        actual_visitors
    )

    nurses = calculate_nurses(
        doctors
    )

    ambulances = calculate_ambulances(
        actual_visitors
    )

    police = calculate_police(
        actual_visitors
    )

    volunteers = calculate_volunteers(
        actual_visitors
    )

    medical_cases = calculate_medical_cases(
        actual_visitors,
        row[5]
    )

    parking = calculate_parking(
        vehicle_count
    )

    cleanliness = calculate_cleanliness(
        actual_visitors
    )

    crowd_density = calculate_crowd_density(
        actual_visitors
    )

    congestion = calculate_congestion(
        vehicle_count,
        average_speed
    )

    emergency = calculate_emergency(
        medical_cases,
        actual_visitors,
        congestion
    )

    row[7] = expected_visitors
    row[8] = actual_visitors
    row[9] = vehicle_count
    row[10] = average_speed
    row[11] = doctors
    row[12] = nurses
    row[13] = ambulances
    row[14] = police
    row[15] = volunteers
    row[16] = medical_cases
    row[17] = parking
    row[19] = cleanliness
    row[20] = crowd_density
    row[21] = congestion
    row[22] = emergency

    return row

# ==========================================================
# Dataset Statistics
# ==========================================================

def show_dataset_summary():

    print("\n")
    print("=" * 65)
    print("AI-Powered Smart Kumbh Mela DSS")
    print("Synthetic Master Dataset")
    print("=" * 65)

    print(f"Total Records           : {NUMBER_OF_RECORDS}")
    print(f"Locations Covered       : {len(LOCATIONS)}")
    print(f"Event Types             : {len(EVENT_TYPES)}")
    print(f"Weather Conditions      : {len(WEATHER_TYPES)}")

    print("\nLocations Included:")

    for location in LOCATIONS:
        print(" •", location)

    print("\nFeatures Included:")

    for header in HEADERS:
        print(" •", header)

    print("=" * 65)


# ==========================================================
# Validate Dataset Configuration
# ==========================================================

def validate_configuration():

    if NUMBER_OF_RECORDS <= 0:
        raise ValueError("NUMBER_OF_RECORDS must be greater than zero.")

    if len(LOCATIONS) == 0:
        raise ValueError("No locations defined.")

    if len(EVENT_TYPES) == 0:
        raise ValueError("No event types defined.")

    if len(WEATHER_TYPES) == 0:
        raise ValueError("No weather types defined.")

    print("Configuration validated successfully.")

# ==========================================================
# Main Function
# ==========================================================

def main():

    print("\nStarting AI-Powered Smart Kumbh Mela Dataset Generator...\n")

    validate_configuration()

    show_dataset_summary()

    generate_dataset()

    print("\nDataset generation completed successfully.")
    print("File saved to:")
    print("app/datasets/kumbh_master_dataset.csv")
    print("\nYou can now use this dataset for:")
    print("✔ Crowd Prediction")
    print("✔ Traffic Prediction")
    print("✔ Medical Prediction")
    print("✔ AI Analytics Dashboard")
    print("✔ Future ML Models")


if __name__ == "__main__":
    main()