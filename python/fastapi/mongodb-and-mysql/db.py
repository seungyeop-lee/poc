from typing import Generator

from beanie import init_beanie
from motor import motor_asyncio
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, DeclarativeBase

from config import BaseConfig
from domain.chat_history.model import ChatHistory

settings = BaseConfig()


async def init_mongo_db():
    mongodb_client = motor_asyncio.AsyncIOMotorClient(settings.MONGO_DB_URL)
    await init_beanie(database=mongodb_client[settings.MONGO_DB_NAME], document_models=[ChatHistory])


class Base(DeclarativeBase):
    pass


SessionLocal = sessionmaker[Session]


async def init_mysql():
    global SessionLocal
    engine = create_engine(settings.MYSQL_DB_URL)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator:
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
