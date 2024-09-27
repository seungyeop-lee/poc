from sqlalchemy import Column, BigInteger, String, func, DateTime

from db import Base


class Log(Base):
    __tablename__ = 'log'
    id = Column(BigInteger, primary_key=True)
    data = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
