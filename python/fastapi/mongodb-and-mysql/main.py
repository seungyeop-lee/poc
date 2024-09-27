from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI

from db import init_mongo_db, init_mysql
from domain.chat_history.router import router as chat_history_router
from domain.log.router import router as log_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    await init_mongo_db()
    await init_mysql()
    yield


app: FastAPI = FastAPI(lifespan=lifespan)

app.include_router(chat_history_router, prefix="/chat-history", tags=["chatHistory"])
app.include_router(log_router, prefix="/log", tags=["log"])

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
