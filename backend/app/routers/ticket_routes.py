from fastapi import APIRouter, Depends, status

from app.db.database import SessionDep
from app.dependencies.user_dependency import get_current_user, role_required
from app.schemas.ticket_schema import (
    TicketCreateResponse,
    TicketInCreate,
    TicketListResponse,
)
from app.schemas.user_schema import Role
from app.services.ticket_service import TicketService


def get_ticket_service(session: SessionDep) -> TicketService:
    return TicketService(session)


router = APIRouter()


@router.post(
    "/tickets",
    status_code=status.HTTP_201_CREATED,
    response_model=TicketCreateResponse,
    dependencies=[Depends(get_current_user)],
)
async def create_ticket(
    ticket_data: TicketInCreate,
    service: TicketService = Depends(get_ticket_service),
):
    """Create a new ticket."""

    try:
        return service.create_ticket(ticket_data)
    except Exception as error:
        raise error


@router.get(
    "/tickets",
    status_code=status.HTTP_200_OK,
    response_model=TicketListResponse,
    dependencies=[Depends(role_required([Role.ADMIN, Role.SUPERADMIN]))],
)
async def get_tickets(
    service: TicketService = Depends(get_ticket_service),
):
    """Retrieve all tickets."""

    try:
        return service.get_tickets()
    except Exception as error:
        raise error


@router.get("/tickets/{ticket_id}", status_code=status.HTTP_200_OK)
async def get_ticket_by_id(
    ticket_id: str,
    service: TicketService = Depends(get_ticket_service),
):
    """Retrieve a ticket by ID."""

    try:
        return service.get_ticket_by_id(ticket_id)
    except Exception as error:
        raise error
