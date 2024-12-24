from uuid import UUID

from pydantic import EmailStr, Field
from sqlmodel import SQLModel

from app.common.shared_schemas import TicketUserPublic, UserPublic


class UserBase(SQLModel):
    firstname: str
    lastname: str
    username: str
    email: EmailStr
    role: str = Field(default="user")


class UserCreate(UserBase):
    password: str = Field(min_length=8)

    model_config = {"extra": "forbid"}


class UserUpdate(SQLModel):
    id: UUID
    firstname: str
    lastname: str
    username: str
    role: str
    email: EmailStr
    password: str = Field(min_length=8)


class UserPublicWithTickets(UserPublic):
    created_tickets: list["TicketUserPublic"] = []
    assigned_tickets: list["TicketUserPublic"] = []


class UserLogin(SQLModel):
    email: EmailStr
    password: str = Field(min_length=8)

    model_config = {"extra": "forbid"}
