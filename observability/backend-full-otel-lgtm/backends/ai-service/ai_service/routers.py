from dataclasses import dataclass

from fastapi import APIRouter

router = APIRouter()

@dataclass
class CreateTermRequest:
    term: str


@dataclass
class CreateTermResponse:
    term: str
    meaning: str


@router.get("/health")
def health():
    return {
        "name": "ai-service",
        "status": "UP"
    }


@router.post("/term/create")
def create_term(request: CreateTermRequest):
    meaning = "Meaning of " + request.term
    return CreateTermResponse(term=request.term, meaning=meaning)
