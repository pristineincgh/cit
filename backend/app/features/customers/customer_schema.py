from typing import TYPE_CHECKING

from sqlmodel import SQLModel

from app.common.shared_schemas import CustomerPublic

if TYPE_CHECKING:
    from ..tickets.ticket_schema import TicketPublic


class CustomerBase(SQLModel):
    name: str
    phone_number: str


class CustomerPublicWithTickets(CustomerPublic):
    tickets: list["TicketPublic"] = []


class CustomerCreate(CustomerBase):
    name: str
    phone_number: str


class CustomerUpdate(CustomerBase):
    pass
