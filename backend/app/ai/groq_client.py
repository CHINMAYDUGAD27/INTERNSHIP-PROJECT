# This file is kept for backward compatibility.
# Groq has been replaced by local Ollama (llama3.2).
# All AI calls now go through app.ai.ollama_client.
#
# If you see this file imported somewhere, update it to use ollama_client directly.

from app.ai.ollama_client import chat  # noqa: F401

# Provide a dummy `client` object with a chat.completions.create() interface
# so any code still using `client.chat.completions.create(...)` won't crash
# immediately — though you should migrate those call sites to use ollama_client.chat().

class _FakeCompletions:
    @staticmethod
    def create(model=None, messages=None, temperature=0.3, **kwargs):
        from app.ai.ollama_client import chat as _chat
        reply = _chat(messages or [], temperature=temperature)
        class _Msg:
            content = reply
        class _Choice:
            message = _Msg()
        class _Resp:
            choices = [_Choice()]
        return _Resp()

class _FakeChatNS:
    completions = _FakeCompletions()

class _FakeClient:
    chat = _FakeChatNS()

client = _FakeClient()