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
PREFERRED_MODELS = [
    "llama-3.3-70b-versatile",   # 128K context — handles large RAG prompts
    "llama-3.1-70b-versatile",
    "llama-3.1-8b-instant",
    "llama3-70b-8192",
    "llama3-8b-8192",
    "mixtral-8x7b-32768",
    # New fallback models for changed Groq catalog
    "openai/gpt-oss-120b",
    "qwen/qwen3.6-27b",
    "groq/compound",
    "allam-2-7b"
]

def _resolve_model():
    """Pick the first available model from our safe preferred list."""
    try:
        available = {m.id for m in _primary_client.models.list().data}
        for m in PREFERRED_MODELS:
            if m in available:
                return m
        # Last resort: explicitly exclude deepseek and restricted
        restricted_keywords = ["whisper", "guard", "orpheus", "canopy", "deepseek", "r1"]
        safe = [
            m for m in available
            if not any(kw in m.lower() for kw in restricted_keywords)
        ]
        safe.sort()
        return safe[0] if safe else PREFERRED_MODELS[0]
    except Exception:
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
