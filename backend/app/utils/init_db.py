from app.db.database import Base, engine
from app.db.models import user_model  # noqa: F401


def create_tables():
    Base.metadata.create_all(bind=engine)
