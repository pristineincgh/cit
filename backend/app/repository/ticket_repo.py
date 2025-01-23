from uuid import uuid4

from app.db.models.customer_model import Customer
from app.db.models.ticket_model import Ticket
from app.db.models.user_model import User
from app.schemas.ticket_schema import (
    TicketCreateResponse,
    TicketInCreate,
    TicketListResponse,
    TicketShortDetails,
)

from .base import BaseRepository


class TicketRepository(BaseRepository):
    def create_ticket(self, ticket_data: TicketInCreate) -> TicketCreateResponse:
        """
        Create a new ticket in the database with proper relationships.
        """

        # Check or create the customer
        if ticket_data.customer_id:
            customer = (
                self.session.query(Customer)
                .filter(Customer.id == ticket_data.customer_id)
                .first()
            )
            if not customer:
                raise ValueError("Customer with the given ID does not exist.")
        else:
            if not ticket_data.customer_name or not ticket_data.phone_number:
                raise ValueError(
                    "Customer name and phone number are required if customer_id is not provided."
                )

            customer = Customer(
                id=str(uuid4()),
                name=ticket_data.customer_name,
                phone_number=ticket_data.phone_number,
            )
            self.session.add(customer)
            self.session.commit()
            self.session.refresh(customer)

        # Create the ticket
        new_ticket = Ticket(
            title=ticket_data.title,
            description=ticket_data.description,
            customer_id=customer.id,
            created_by_id=ticket_data.created_by_id,
            assigned_to_id=ticket_data.assigned_to_id,
            priority=ticket_data.priority,
            status=ticket_data.status,
        )

        self.session.add(new_ticket)
        self.session.commit()
        self.session.refresh(new_ticket)

        # Fetch related user data
        created_by_user = (
            self.session.query(User)
            .filter(User.id == ticket_data.created_by_id)
            .first()
        )
        assigned_to_user = (
            self.session.query(User)
            .filter(User.id == ticket_data.assigned_to_id)
            .first()
        )

        if not created_by_user:
            raise ValueError("Created by user does not exist.")
        if not assigned_to_user:
            raise ValueError("Assigned to user does not exist.")

        # Construct and return the response
        return TicketCreateResponse(
            message="Ticket created successfully.",
            ticket=TicketShortDetails(
                id=new_ticket.id,
                title=new_ticket.title,
                description=new_ticket.description,
                customer=customer.name,
                created_by=f"{created_by_user.first_name} {created_by_user.last_name}",
                assigned_to=f"{assigned_to_user.first_name} {assigned_to_user.last_name}",
                priority=new_ticket.priority,
                status=new_ticket.status,
                created_at=new_ticket.created_at,
                updated_at=new_ticket.updated_at,
            ),
        )

    def get_ticket_by_id(self, ticket_id: str) -> Ticket:
        """
        Retrieve a ticket by ID.
        """
        return self.session.query(Ticket).filter(Ticket.id == ticket_id).first()

    def get_tickets(self) -> TicketListResponse:
        """
        Retrieve all tickets.
        """
        tickets = self.session.query(Ticket).all()

        return TicketListResponse(
            total=len(tickets),
            tickets=[
                TicketShortDetails(
                    id=ticket.id,
                    title=ticket.title,
                    description=ticket.description,
                    customer=ticket.customer.name,
                    created_by=f"{ticket.created_by.first_name} {ticket.created_by.last_name}",
                    assigned_to=f"{ticket.assigned_to.first_name} {ticket.assigned_to.last_name}",
                    priority=ticket.priority,
                    status=ticket.status,
                    created_at=ticket.created_at,
                    updated_at=ticket.updated_at,
                )
                for ticket in tickets
            ],
        )
