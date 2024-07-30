import time

from fastapi import FastAPI
from dataclasses import dataclass

app = FastAPI()


@dataclass
class CreateTermRequest:
    term: str


@dataclass
class CreateTermResponse:
    term: str
    meaning: str


@app.get("/health")
def health():
    return {
        "name": "ai-service",
        "status": "UP"
    }


@app.post("/term/create")
def create_term(request: CreateTermRequest):
    meaning = "Meaning of " + request.term
    return CreateTermResponse(term=request.term, meaning=meaning)
