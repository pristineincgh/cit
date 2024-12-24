from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

import sqlalchemy.dialects.postgresql as pg
from pydantic import EmailStr
from sqlmodel import Column, Field, Relationship, SQLModel

if TYPE_CHECKING:
    from ..tickets.ticket_model import Ticket


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(
        sa_column=Column(pg.UUID, nullable=False, primary_key=True, default=uuid4)
    )
    username: str = Field(unique=True, index=True)
    email: EmailStr = Field(unique=True, index=True)
    firstname: str
    lastname: str
    role: str = Field(
        sa_column=Column(pg.VARCHAR, nullable=False, server_default="user")
    )
    password_hash: str = Field(exclude=True)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, nullable=False, default=datetime.now)
    )
    updated_at: datetime = Field(
        sa_column=Column(pg.TIMESTAMP, nullable=False, default=datetime.now)
    )
    created_tickets: list["Ticket"] = Relationship(
        back_populates="creator",
        cascade_delete=True,
        sa_relationship_kwargs={
            "lazy": "selectin",
            "foreign_keys": "Ticket.creator_id",
        },
    )
    assigned_tickets: list["Ticket"] = Relationship(
        back_populates="owner",
        cascade_delete=True,
        sa_relationship_kwargs={"lazy": "selectin", "foreign_keys": "Ticket.owner_id"},
    )

    def __repr__(self):
        return f"<User {self.username}>"
