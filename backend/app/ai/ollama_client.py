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

def _resolve_model():
    """Fetch available models and pick a valid chat model dynamically."""
    try:
        available = [m.id for m in _client.models.list().data]
        # Prefer standard Groq models if they exist
        for m in ["llama-3.1-8b-instant", "llama3-8b-8192", "mixtral-8x7b-32768"]:
            if m in available:
                return m
        
        # Fallback to whatever non-audio models are available in the current API key's project
        valid = [m for m in available if "whisper" not in m and "guard" not in m]
        return valid[0] if valid else available[0]
    except Exception:
        return "llama-3.1-8b-instant"

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
