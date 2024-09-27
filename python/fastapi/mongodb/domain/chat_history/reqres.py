from pydantic import BaseModel, Field


class ChatMessageRequest(BaseModel):
    role: str = Field(...)
    message: str = Field(...)


class CreateChatHistoryRequest(BaseModel):
    system_prompt: str = Field(examples=["너는 친절한 어시스턴트야."])
    context_prompt: list[ChatMessageRequest] = Field(examples=[[{"role": "user", "message": "너는 누구니?"}]])
    assistant_message: str = Field(examples=["안녕하세요. 저는 어시스턴트입니다!"])
