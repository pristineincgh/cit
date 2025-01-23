from sqlalchemy.orm import Session


class BaseRepository:
    """
    Base repository class that all other repositories inherit from.
    """

    def __init__(self, session: Session):
        self.session = session
