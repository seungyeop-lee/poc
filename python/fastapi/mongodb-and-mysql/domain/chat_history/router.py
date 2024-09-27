from bson.objectid import ObjectId
from fastapi import APIRouter

from domain.chat_history.model import ChatHistory

router = APIRouter()


@router.get("/{oid}")
async def get_chat_history(oid: str):
    found = await ChatHistory.find_one({"_id": ObjectId(oid)})
    return found
