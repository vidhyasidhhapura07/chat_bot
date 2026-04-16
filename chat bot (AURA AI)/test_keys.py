import os
from openai import OpenAI

keys_to_test = [
    ("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", "https://openrouter.ai/api/v1", "deepseek/deepseek-chat"),
    ("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", "https://openrouter.ai/api/v1", "deepseek/deepseek-chat"),
    ("sk-9eabdf1241734cc49dafaf3290117a4a", "https://api.deepseek.com", "deepseek-chat"),
    ("sk-bd84a430d6304662bcf1ae2986bc9c86", "https://api.deepseek.com", "deepseek-chat")
]

for key, url, model in keys_to_test:
    client = OpenAI(api_key=key, base_url=url)
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": "Hi"}],
            max_tokens=5
        )
        print(f"SUCCESS with key {key} at {url}")
    except Exception as e:
        print(f"FAILED with key {key} at {url} -> Error: {e}")
