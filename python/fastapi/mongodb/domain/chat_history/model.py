from datetime import datetime

from beanie import Document
from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(...)
    message: str = Field(...)


class ChatHistoryDetail(BaseModel):
    systemPrompt: str = Field(...)
    contextPrompt: list[ChatMessage] = Field(...)
    modelMessage: str = Field(...)


class ChatHistory(Document):
    detail: ChatHistoryDetail = Field(...)
    created_at: datetime = Field(...)

    class Settings:
        name = "chat_history"
