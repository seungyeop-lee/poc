import os
from google import genai
from google.genai import types

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
model_name = "gemini-2.0-flash-exp"


def get_current_weather(
    location: str,
) -> str:
    """
    Returns the current weather.

    Args:
      location: The city and state, e.g. San Francisco, CA
    """
    print(location)
    return "rainy"


def generate_text_by_function(prompt: str):
    response = client.models.generate_content(
        model=model_name,
        contents=prompt,
        config=types.GenerateContentConfig(tools=[get_current_weather]),
    )
    return response.text


def main():
    prompt = "What is the weather like in Boston?"
    result = generate_text_by_function(prompt)
    print(result)


if __name__ == "__main__":
    main()
