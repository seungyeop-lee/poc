from contextlib import asynccontextmanager

import uvicorn
from beanie import init_beanie
from fastapi import FastAPI
from motor import motor_asyncio

from config import BaseConfig
from domain.chat_history.model import ChatHistory
from domain.chat_history.router import router as chat_history_router

settings = BaseConfig()


async def init_db():
    mongodb_client = motor_asyncio.AsyncIOMotorClient(settings.DB_URL)
    await init_beanie(database=mongodb_client[settings.DB_NAME], document_models=[ChatHistory])


@asynccontextmanager
async def lifespan(_: FastAPI):
    await init_db()
    yield


app: FastAPI = FastAPI(lifespan=lifespan)

app.include_router(chat_history_router, prefix="/chat-history", tags=["chatHistory"])

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
