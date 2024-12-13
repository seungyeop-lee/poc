import asyncio
import logging
import os

from google import genai
from google.genai import types

client = genai.Client(
    api_key=os.environ["GEMINI_API_KEY"],
    http_options={"api_version": "v1alpha"},
)
model_name = "gemini-2.0-flash-exp"

logger = logging.getLogger("Live")
# logger.setLevel('DEBUG')  # Switch between "INFO" and "DEBUG" to toggle debug messages.
logger.setLevel("INFO")


async def run(prompt, modality="TEXT", tools=None):
    if tools is None:
        tools = []

    config = {"tools": tools, "generation_config": {"response_modalities": [modality]}}

    async with client.aio.live.connect(model=model_name, config=config) as session:
        print(prompt)
        print("-------------------------------")
        await session.send(prompt, end_of_turn=True)

        async for response in session.receive():
            logger.debug(str(response))

            server_content = response.server_content
            if server_content is not None:
                handle_server_content(server_content)

            tool_call = response.tool_call
            if tool_call is not None:
                await handle_tool_call(session, tool_call)


def handle_server_content(server_content):
    model_turn = server_content.model_turn
    if model_turn:
        for part in model_turn.parts:
            text = part.text
            if text is not None:
                print(text)

            inline_data = part.inline_data
            if inline_data is not None:
                print(".", end="")

            executable_code = part.executable_code
            if executable_code is not None:
                print("-------------------------------")
                print(f"``` python\n{executable_code.code}\n```")
                print("-------------------------------")

            code_execution_result = part.code_execution_result
            if code_execution_result is not None:
                print("-------------------------------")
                print(f"```\n{code_execution_result.output}\n```")
                print("-------------------------------")

    grounding_metadata = getattr(server_content, "grounding_metadata", None)
    if grounding_metadata is not None:
        print(grounding_metadata.search_entry_point.rendered_content)


async def handle_tool_call(session, tool_call):
    for fc in tool_call.function_calls:
        tool_response = types.LiveClientToolResponse(
            function_responses=[
                types.FunctionResponse(
                    name=fc.name,
                    id=fc.id,
                    response={"result": "ok"},
                )
            ]
        )

        print(">>> ", tool_response)
        await session.send(tool_response)


turn_on_the_lights = {"name": "turn_on_the_lights"}
turn_off_the_lights = {"name": "turn_off_the_lights"}


async def simple_function_call():
    prompt = "Turn on the lights"

    tools = [{"function_declarations": [turn_on_the_lights, turn_off_the_lights]}]

    await run(prompt, tools=tools, modality="TEXT")


async def code_execution():
    prompt = "What is the largest prime palindrome under 100000."

    tools = [{"code_execution": {}}]

    await run(prompt, tools=tools, modality="TEXT")


async def google_search():
    prompt = "Can you use google search tell me about the largest earthquake in california the week of Dec 5 2024?"

    tools = [{"google_search": {}}]

    await run(prompt, tools=tools, modality="TEXT")


async def multi_tool():
    prompt = """\
      Hey, I need you to do three things for me.

      1. Then compute the largest prime plaindrome under 100000.
      2. Then use google search to lookup unformation about the largest earthquake in california the week of Dec 5 2024?
      3. Turn on the lights

      Thanks!
      """

    tools = [
        {"google_search": {}},
        {"code_execution": {}},
        {"function_declarations": [turn_on_the_lights, turn_off_the_lights]},
    ]

    await run(prompt, tools=tools, modality="TEXT")


if __name__ == "__main__":
    # asyncio.run(simple_function_call())
    # asyncio.run(code_execution())
    # asyncio.run(google_search())
    asyncio.run(multi_tool())
