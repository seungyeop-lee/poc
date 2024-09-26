from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from motor import motor_asyncio

from config import BaseConfig

settings = BaseConfig()


@asynccontextmanager
async def db_lifespan(app: FastAPI):
    # Startup
    app.mongodb_client = motor_asyncio.AsyncIOMotorClient(settings.DB_URL)
    app.database = app.mongodb_client[settings.DB_NAME]
    ping_response = await app.database.command("ping")
    if int(ping_response["ok"]) != 1:
        raise Exception("Problem connecting to database cluster.")
    else:
        print("Connected to database cluster.")

    yield

    # Shutdown
    app.mongodb_client.close()


app: FastAPI = FastAPI(lifespan=db_lifespan)

if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
