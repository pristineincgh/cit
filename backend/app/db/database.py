from typing import Annotated

from app.core.config import get_settings
from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session, sessionmaker

settings = get_settings()

url_obj = URL.create(
    drivername="postgresql+psycopg",
    username=settings.db.user,
    password=settings.db.password,
    host=settings.db.host,
    port=settings.db.port,
    database=settings.db.name,
)

engine = create_engine(url=url_obj, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


SessionDep = Annotated[Session, Depends(get_db)]
