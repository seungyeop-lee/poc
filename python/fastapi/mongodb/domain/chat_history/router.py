from datetime import datetime
from pprint import pprint
from typing import Optional, List

from fastapi import APIRouter, status, Query

from .model import ChatHistory, ChatHistoryDetail, ChatMessage
from .reqres import CreateChatHistoryRequest

router = APIRouter()


@router.post("", response_description="Create chat history", status_code=status.HTTP_201_CREATED)
async def create_chat_history(req: CreateChatHistoryRequest):
    chat_history = ChatHistory(
        detail=(ChatHistoryDetail(
            systemPrompt=req.systemPrompt,
            contextPrompt=[ChatMessage(role=chat.role, message=chat.message) for chat in req.contextPrompt],
            modelMessage=req.modelMessage
        )),
        created_at=datetime.now()
    )
    saved: ChatHistory = await chat_history.save()
    pprint(saved)
    return saved.id


@router.get("/search", response_description="Search chat history")
async def search_chat_history(
        query: Optional[str] = Query(None, description="Query string to search in chat messages"),
        start_time: Optional[datetime] = Query(None, description="Start time for the search range"),
        end_time: Optional[datetime] = Query(None, description="End time for the search range")
) -> List[ChatHistory]:
    search_filter = {}
    apply_query(query, search_filter)
    apply_time_condition(start_time, end_time, search_filter)
    results = await ChatHistory.find(search_filter).to_list()
    return results


def apply_query(query, search_filter):
    if query:
        search_filter["$or"] = [
            {"detail.contextPrompt.message": {"$regex": query, "$options": "i"}},
            {"detail.systemPrompt": {"$regex": query, "$options": "i"}},
            {"detail.modelMessage": {"$regex": query, "$options": "i"}}
        ]


def apply_time_condition(start_time, end_time, search_filter):
    if start_time and end_time:
        search_filter["created_at"] = {"$gte": start_time, "$lte": end_time}
    elif start_time:
        search_filter["created_at"] = {"$gte": start_time}
    elif end_time:
        search_filter["created_at"] = {"$lte": end_time}
