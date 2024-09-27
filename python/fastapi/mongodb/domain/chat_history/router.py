import csv
from datetime import datetime
from io import StringIO
from pprint import pprint
from typing import Optional, List

from bson.objectid import ObjectId
from fastapi import APIRouter, status, Query, Body
from fastapi.responses import StreamingResponse

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


@router.post("/export", response_description="Export chat history to CSV")
async def export_chat_history(ids: List[str] = Body(...)) -> StreamingResponse:
    object_ids = [ObjectId(oid) for oid in ids]
    chat_histories = await ChatHistory.find_many({"_id": {"$in": object_ids}}).to_list()

    output = mapToCsv(chat_histories)

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=chat_history.csv"}
    )


def mapToCsv(chat_histories: list[ChatHistory]) -> StringIO:
    output = StringIO()
    writer = csv.writer(output)
    writer.writerow(["id", "systemPrompt", "contextPrompt", "modelMessage", "createdAt"])
    for chat_history in chat_histories:
        writer.writerow([
            str(chat_history.id),
            chat_history.detail.systemPrompt,
            " | ".join([f"{msg.role}: {msg.message}" for msg in chat_history.detail.contextPrompt]),
            chat_history.detail.modelMessage,
            chat_history.created_at.isoformat()
        ])
    return output
