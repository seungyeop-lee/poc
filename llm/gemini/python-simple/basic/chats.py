import os
from typing import Any, Generator

from google import genai
from google.genai import types
from google.genai.chats import Chat
from google.genai.types import GenerateContentResponse

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
model_name = "gemini-2.0-flash-exp"


class ChatManager:
    chat: Chat | None = None

    def start_chat(self, system_instruction: str | None) -> None:
        self.chat = client.chats.create(
            model=model_name,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.5,
            ),
        )

    def send_message(
        self, message: str
    ) -> Generator[GenerateContentResponse, Any, None]:
        response = self.chat._send_message_stream(message)
        return response


def main():
    chat_manager = ChatManager()

    system_instruction = """
              You are an expert software developer and a helpful coding assistant.
              You are able to generate high-quality code in any programming language.
            """
    chat_manager.start_chat(system_instruction=system_instruction)

    prompt = "Write a function that checks if a year is a leap year."
    print(f"user: {prompt}")
    first = True
    for chunk in chat_manager.send_message(prompt):
        if first:
            print("gemini: ")
            first = False

        print(chunk.text)

    print("-------------------------------")

    prompt = "Okay, write a unit test of the generated function."
    print(f"user: {prompt}")
    first = True
    for chunk in chat_manager.send_message(prompt):
        if first:
            print("gemini: ")
            first = False

        print(chunk.text)


if __name__ == "__main__":
    main()
