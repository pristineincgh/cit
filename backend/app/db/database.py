from typing import Annotated

from fastapi import Depends
from sqlalchemy.engine import URL
from sqlmodel import Session, SQLModel, create_engine

from app.core.config import get_settings

settings = get_settings()

url_obj = URL.create(
    drivername="postgresql+psycopg",
    username=settings.db.user,
    password=settings.db.password,
    host=settings.db.host,
    port=settings.db.port,
    database=settings.db.name,
)

engine = create_engine(url=url_obj)


def init_db():
    """Create DB and tables"""
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
