from datetime import datetime
from uuid import uuid4

from sqlalchemy import Boolean, Column, DateTime, Enum, String
from sqlalchemy.orm import relationship

from app.db.database import Base
from app.schemas.user_schema import Role


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    username = Column(String(50), unique=True, index=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(250), nullable=False)
    role = Column(Enum(Role), nullable=False, default=Role.AGENT.value)
    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    updated_at = Column(
        DateTime, nullable=False, default=datetime.now, onupdate=datetime.now
    )

    # Relationships
    created_tickets = relationship(
        "Ticket", foreign_keys="Ticket.created_by_id", back_populates="created_by"
    )
    assigned_tickets = relationship(
        "Ticket", foreign_keys="Ticket.assigned_to_id", back_populates="assigned_to"
    )

    def __repr__(self):
        return f"<User {self.username}>"
