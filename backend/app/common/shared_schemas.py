from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import EmailStr
from sqlmodel import SQLModel


class UserPublic(SQLModel):
    id: UUID
    firstname: str
    lastname: str
    username: str
    email: EmailStr
    role: str
    is_verified: bool
    created_at: datetime
    updated_at: datetime


class UserTicketPublic(SQLModel):
    id: UUID
    firstname: str
    lastname: str
    email: EmailStr


class TicketPublic(SQLModel):
    id: UUID
    title: str
    description: Optional[str] = None
    status: str = "open"
    priority: str = "medium"
    created_at: datetime
    updated_at: datetime


class TicketUserPublic(SQLModel):
    id: UUID
    title: str
    description: Optional[str] = None
    status: str = "open"
    priority: str = "medium"


class CustomerPublic(SQLModel):
    id: UUID
    name: str
    phone_number: str
    created_at: datetime
    updated_at: datetime


class CustomerTicketPublic(SQLModel):
    id: UUID
    name: str
    phone_number: str
