from app.ai.ollama_client import chat
from app.ai.prompts import TRAFFIC_AI_PROMPT


def analyze_traffic(
    location,
    road_name,
    vehicle_count,
    average_speed,
    congestion_level
):

    prompt = f"""

Nashik Kumbh Mela Traffic Analysis

Location:
{location}

Road:
{road_name}

Vehicle Count:
{vehicle_count}

Average Speed:
{average_speed} km/h

Predicted Congestion:
{congestion_level}


{TRAFFIC_AI_PROMPT}

"""

    messages = [
        {
            "role": "user",
            "content": prompt
        }
    ]

    return chat(messages, temperature=0.3)