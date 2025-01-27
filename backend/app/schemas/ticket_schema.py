from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional

from pydantic import BaseModel, EmailStr

from app.schemas.customer_schema import CustomerOut
from app.schemas.user_schema import Role


class Status(PyEnum):
    """
    This enum class is used to define the ticket status.

    The status can be one of the following:
    - open
    - in_progress
    - resolved
    - closed
    """

    OPEN = "open"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"


class Priority(PyEnum):
    """
    This enum class is used to define the ticket priority.

    The priority can be one of the following:
    - low
    - medium
    - high
    """

    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TicketInCreate(BaseModel):
    """
    This class is used to validate the ticket data when creating a new ticket.
    """

    title: str
    description: Optional[str] = None
    customer_id: Optional[str] = None  # Optional for new customers
    customer_name: Optional[str] = None  # Required if customer_id is not provided
    phone_number: Optional[str] = None  # Required if customer_id is not provided
    created_by_id: str
    assigned_to_id: str
    priority: Optional[str] = Priority.MEDIUM
    status: Optional[str] = Status.OPEN


class TicketShortDetails(BaseModel):
    """
    This class is used to return the minimum details of a ticket.
    """

    id: str
    title: str
    description: Optional[str] = None
    customer: str
    created_by: str
    assigned_to: str
    priority: Priority
    status: Status
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TicketCreateResponse(BaseModel):
    """
    This class is used to return the ticket data when creating a new ticket.
    """

    message: str
    ticket: TicketShortDetails

    model_config = {"from_attributes": True}


class TicketDetailsUser(BaseModel):
    """
    This class is used to return the user data when returning ticket details.
    """

    id: str
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    role: Role

    model_config = {"from_attributes": True}


class TicketDetailsResponse(BaseModel):
    """
    This class is used to return the ticket details.
    """

    id: str
    title: str
    description: Optional[str] = None
    customer: CustomerOut
    created_by: TicketDetailsUser
    assigned_to: TicketDetailsUser
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class TicketListResponse(BaseModel):
    """
    This class is used to return the list of tickets.
    """

    total: int
    tickets: list[TicketShortDetails]

    model_config = {"from_attributes": True}
