import os
from google import genai

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
model_name = "gemini-2.0-flash-exp"


def generate_text(prompt: str):
    response = client.models.generate_content(model=model_name, contents=[prompt])
    return response.text


def main():
    prompt = """
    Italy : Rome
    France : Paris
    Germany : 
    """
    result = generate_text(prompt)
    print(result)


if __name__ == "__main__":
    main()
