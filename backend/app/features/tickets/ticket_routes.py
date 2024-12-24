from typing import List

from fastapi import APIRouter, Depends, status

from app.db.database import SessionDep

from ..auth.auth_dependencies import AccessTokenBearer, RoleChecker
from .ticket_schema import (
    TicketCreate,
    TicketPublic,
    TicketPublicWithOwnerAndCustomer,
    TicketUpdate,
)
from .ticket_service import TicketService

# role checkers
universal_checker = Depends(RoleChecker(["admin", "user"]))
admin_checker = Depends(RoleChecker(["admin"]))

# from app.utils import is_valid_uuid

router = APIRouter()
service = TicketService()

TokenDep = Depends(AccessTokenBearer())


@router.get(
    "/",
    response_model=List[TicketPublicWithOwnerAndCustomer],
    status_code=status.HTTP_200_OK,
    dependencies=[admin_checker],
)
async def get_all_tickets(session: SessionDep, token_details: dict = TokenDep):
    """Retrieve all tickets"""

    tickets = service.get_all_tickets(session)
    return tickets


@router.get(
    "/user/{user_id}",
    response_model=List[TicketPublic],
    status_code=status.HTTP_200_OK,
    dependencies=[universal_checker],
)
async def get_tickets_by_user(
    user_id: str, session: SessionDep, token_details: dict = TokenDep
):
    """Retrieve all tickets created by current user"""

    tickets = service.get_user_tickets(user_id, session)
    return tickets


@router.post(
    "/",
    response_model=TicketPublic,
    status_code=status.HTTP_201_CREATED,
    dependencies=[universal_checker],
)
async def create_ticket(
    ticket_data: TicketCreate,
    session: SessionDep,
    token_details: dict = TokenDep,
) -> dict:
    """Create a new ticket"""

    user_id = token_details.get("user")["user_id"]

    new_ticket = service.create_ticket(ticket_data, user_id, session)
    return new_ticket


@router.get(
    "/{ticket_id}",
    response_model=TicketPublicWithOwnerAndCustomer,
    status_code=status.HTTP_200_OK,
    dependencies=[universal_checker],
)
async def get_ticket(
    ticket_id: str,
    session: SessionDep,
    token_details: dict = TokenDep,
) -> dict:
    """Retrieve a single ticket by ID"""
    ticket = service.get_ticket(ticket_id, session)
    return ticket


@router.put(
    "/{ticket_id}",
    response_model=TicketPublic,
    status_code=status.HTTP_200_OK,
    dependencies=[universal_checker],
)
async def update_ticket(
    ticket_id: str,
    ticket_data: TicketUpdate,
    session: SessionDep,
    token_details: dict = TokenDep,
):
    """Update details of a single ticket"""
    updated_ticket = service.update_ticket(ticket_id, ticket_data, session)
    return updated_ticket


@router.delete(
    "/{ticket_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[admin_checker],
)
async def delete_ticket(
    ticket_id: str,
    session: SessionDep,
    token_details: dict = TokenDep,
):
    """Delete a ticket"""
    service.delete_ticket(ticket_id, session)
