from datetime import datetime

from beanie import Document
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(...)
    message: str = Field(...)


class ChatHistoryDetail(BaseModel):
    system_prompt: str = Field(...)
    context_prompt: list[ChatMessage] = Field(...)
    assistant_message: str = Field(...)


class ChatHistory(Document):
    detail: ChatHistoryDetail = Field(...)
    created_at: datetime = Field(...)

    class Settings:
        name = "chat_history"
