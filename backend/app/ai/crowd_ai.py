from app.ai.ollama_client import chat
from app.ai.prompts import CROWD_PROMPT


def analyze_crowd(
    location,
    expected_visitors,
    actual_visitors,
    risk_level
):

    prompt = f"""
Nashik Kumbh Mela Crowd Analysis

Location:
{location}

Expected Visitors:
{expected_visitors}

Actual Visitors:
{actual_visitors}

Predicted Risk:
{risk_level}


{CROWD_PROMPT}
"""

    messages = [
        {
            "role": "user",
            "content": prompt
        }
    ]

    return chat(messages, temperature=0.3)