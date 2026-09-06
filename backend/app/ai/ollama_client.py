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
# API Key Setup & Client Initialization
# ---------------------------------------------------------------------------
# Allow multiple API keys separated by commas (e.g., "key1,key2,key3")
raw_keys = os.environ.get("GROQ_API_KEY", "")
api_keys = [k.strip() for k in raw_keys.split(",") if k.strip()]

if not api_keys:
    api_keys = [""] # Fallback so initialization doesn't immediately crash

_clients = [Groq(api_key=key) for key in api_keys]
_primary_client = _clients[0]

# ---------------------------------------------------------------------------
# Model selection
# ---------------------------------------------------------------------------
# Ordered by availability & reliability — most stable models first.
# NOTE: Classic llama models (llama-3.x) are NOT available on this account's keys.
# Available models discovered at startup (see logs):
#   openai/gpt-oss-120b, openai/gpt-oss-20b, qwen/qwen3.8-27b,
#   qwen/qwen3.6-27b, groq/compound, groq/compound-mini, allam-2-7b
PREFERRED_MODELS = [
    "openai/gpt-oss-120b",       # Best quality available on this account
    "openai/gpt-oss-20b",        # Faster GPT OSS variant
    "qwen/qwen3.8-27b",          # Qwen 3.8 27B
    "qwen/qwen3.6-27b",          # Qwen 3.6 27B
    "groq/compound",             # Groq compound model
    "groq/compound-mini",        # Groq compound mini
    "llama-3.1-8b-instant",      # Fast llama (if access is granted)
    "llama-3.3-70b-versatile",   # 128K context llama (if access is granted)
    "llama-3.1-70b-versatile",   # Large llama (if access is granted)
    "llama3-8b-8192",            # Legacy llama fallback
    "llama3-70b-8192",           # Legacy llama fallback
    "mixtral-8x7b-32768",        # Legacy mixtral fallback
    "gemma2-9b-it",              # Google Gemma fallback
    "allam-2-7b",                # Last resort — always available
]

def _resolve_model():
    """Pick the first available model from our safe preferred list."""
    try:
        available = {m.id for m in _primary_client.models.list().data}
        print(f"[Groq Client] Available models: {sorted(available)}")
        # Exclude audio/vision-only and restricted models
        restricted_keywords = ["whisper", "guard", "orpheus", "canopy", "deepseek", "r1", "tts", "vision"]
        for m in PREFERRED_MODELS:
            if m in available:
                print(f"[Groq Client] Selected model: {m}")
                return m
        # Last resort: pick any safe text model
        safe = [
            m for m in sorted(available)
            if not any(kw in m.lower() for kw in restricted_keywords)
        ]
        if safe:
            print(f"[Groq Client] No preferred model found. Using fallback: {safe[0]}")
            return safe[0]
        # Absolute last resort
        print(f"[Groq Client] WARNING: Could not find any available model. Using: {PREFERRED_MODELS[0]}")
        return PREFERRED_MODELS[0]
    except Exception as e:
        # On auth failure or network error, default to the smallest/most-available model
        print(f"[Groq Client] WARNING: Could not list models ({e}). Defaulting to: {PREFERRED_MODELS[0]}")
        return PREFERRED_MODELS[0]

GROQ_CHAT_MODEL = _resolve_model()


def chat(messages: list[dict], temperature: float = 0.2) -> str:
    """
    Send a list of {role, content} messages to Groq and return the assistant reply.
    Automatically tries the next API key if one hits a rate limit or authorization error.
    """
    last_exception = None
    
    for i, client in enumerate(_clients):
        try:
            completion = client.chat.completions.create(
                model=GROQ_CHAT_MODEL,
                messages=messages,
                temperature=temperature,
                max_tokens=2048,
                top_p=0.9,
                stream=False,
            )
            return completion.choices[0].message.content.strip()
        except Exception as e:
            last_exception = e
            error_str = str(e).lower()
            
            # If rate limit (429) or invalid auth (401) occurs, and we have another key to try:
            if ("429" in error_str or "rate limit" in error_str or "401" in error_str) and i < len(_clients) - 1:
                print(f"[Groq Client] Key {i+1} failed with {type(e).__name__}. Falling back to Key {i+2}...")
                continue
            
            # If it's a different error or we're out of keys, raise it
            raise
            
    if last_exception:
        raise last_exception
    return ""


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
