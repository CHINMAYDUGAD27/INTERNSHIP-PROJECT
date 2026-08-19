"""
Groq Cloud AI client for KumbhAI.
Replaces the local Ollama server with Groq's cloud API.

Model: llama-3.1-8b-instant  (fast, accurate, free tier)
Fallback: llama3-8b-8192

Why Groq?
  - Works on Render / any cloud deployment (no local server needed)
  - Extremely fast inference (tokens per second >> Ollama on CPU)
  - Free tier is generous enough for demos and production
  - Same chat() interface as before — nothing else in the codebase changes

Get your free API key at: https://console.groq.com
Set it as GROQ_API_KEY in your .env file.
"""

import os
from groq import Groq

# ---------------------------------------------------------------------------
# Model selection
# ---------------------------------------------------------------------------
# Initialise Groq client (reads GROQ_API_KEY from environment automatically)
_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# ---------------------------------------------------------------------------
# Hardcode a safe, always-available Groq chat model.
# Dynamic model discovery was picking 'canopylabs/orpheus' which requires
# terms acceptance. We use a fixed priority list instead.
# ---------------------------------------------------------------------------
PREFERRED_MODELS = [
    "llama-3.1-8b-instant",
    "llama3-8b-8192",
    "llama3-70b-8192",
    "mixtral-8x7b-32768",
]

def _resolve_model():
    """Pick the first available model from our safe preferred list."""
    try:
        available = {m.id for m in _client.models.list().data}
        for m in PREFERRED_MODELS:
            if m in available:
                return m
        # Last resort: any model that is NOT a restricted/terms-required one
        restricted_keywords = ["whisper", "guard", "orpheus", "canopy"]
        safe = [
            m for m in available
            if not any(kw in m.lower() for kw in restricted_keywords)
        ]
        return safe[0] if safe else PREFERRED_MODELS[0]
    except Exception:
        return PREFERRED_MODELS[0]

GROQ_CHAT_MODEL = _resolve_model()


def chat(messages: list[dict], temperature: float = 0.2) -> str:
    """
    Send a list of {role, content} messages to Groq and return the assistant reply.

    Drop-in replacement for the old ollama_client.chat() — same signature.

    Generation settings tuned for accurate, on-topic answers:
      - temperature=0.2  → more deterministic / factual
      - max_tokens=800   → enough for detailed answers without rambling
    """
    completion = _client.chat.completions.create(
        model=GROQ_CHAT_MODEL,
        messages=messages,
        temperature=temperature,
        max_tokens=800,
        top_p=0.9,
        stream=False,
    )
    return completion.choices[0].message.content.strip()


def embed(text: str) -> list[float]:
    """
    Stub: Groq does not provide an embeddings endpoint.
    The current RAG implementation uses prompt-stuffing (not vector search),
    so this function is never called in production.
    Kept here for interface compatibility.
    """
    raise NotImplementedError(
        "Groq does not support embeddings. "
        "The project uses prompt-based RAG, so this is never called."
    )
