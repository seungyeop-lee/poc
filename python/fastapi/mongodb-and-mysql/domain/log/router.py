from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db import get_db
from domain.log.model import Log

router = APIRouter()


@router.get("/{id}")
async def get_log(id: str, db: Session = Depends(get_db)):
    return db.query(Log).filter(Log.id == id).first()
