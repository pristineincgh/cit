from app.db.models.ticket_model import Ticket
from app.repository.ticket_repo import TicketRepository
from app.schemas.ticket_schema import (
    TicketCreateResponse,
    TicketInCreate,
    TicketListResponse,
)
from fastapi import HTTPException, status
from sqlalchemy.orm import Session


class TicketService:
    def __init__(self, session: Session):
        self._repository = TicketRepository(session)

    def create_ticket(self, ticket_data: TicketInCreate) -> TicketCreateResponse:
        """
        Create a new ticket.
        """

        # create a new ticket
        return self._repository.create_ticket(ticket_data)

    def get_ticket_by_id(self, ticket_id: str) -> Ticket:
        """
        Retrieve a ticket by ID.
        """
        ticket = self._repository.get_ticket_by_id(ticket_id)

        if not ticket:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Ticket not found.",
            )

        return ticket

    def get_tickets(self) -> TicketListResponse:
        """
        Retrieve all tickets.
        """
        return self._repository.get_tickets()
