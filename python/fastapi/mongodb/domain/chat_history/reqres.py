from pydantic import BaseModel, Field


class ChatMessageRequest(BaseModel):
    role: str = Field(...)
    message: str = Field(...)


class CreateChatHistoryRequest(BaseModel):
    systemPrompt: str = Field(examples=["너는 친절한 어시스턴트야."])
    contextPrompt: list[ChatMessageRequest] = Field(examples=[[{"role": "user", "message": "너는 누구니?"}]])
    modelMessage: str = Field(examples=["안녕하세요. 저는 어시스턴트입니다!"])
