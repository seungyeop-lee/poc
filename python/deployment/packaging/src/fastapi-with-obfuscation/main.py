import uvicorn
from fastapi import FastAPI

from app import api_router

app = FastAPI()
app.include_router(api_router)


def serve():
    uvicorn.run(app)


if __name__ == "__main__":
    serve()
