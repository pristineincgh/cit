from fastapi import HTTPException, status
from sqlmodel import Session, desc, select

from app.features.auth.auth_model import User
from app.features.customers.customer_model import Customer
from app.features.customers.customer_schema import CustomerCreate
from app.utils.api_exceptions import CustomerNotFound, TicketNotFound, UserNotFound

from ..customers.customer_service import CustomerService
from .ticket_model import Ticket
from .ticket_schema import TicketCreate, TicketUpdate

customer_service = CustomerService()


class TicketService:
    def get_all_tickets(self, session: Session):
        """Retrieve all tickets from database"""
        statement = select(Ticket).order_by(desc(Ticket.created_at))
        result = session.exec(statement)

        return result.all()

    def get_user_tickets(self, user_id: str, session: Session):
        """Retrieve all tickets created by current user"""
        statement = (
            select(Ticket)
            .where(Ticket.owner_id == user_id)
            .order_by(desc(Ticket.created_at))
        )
        result = session.exec(statement)

        return result.all()

    def get_ticket(self, ticket_id: str, session: Session):
        """Retrieve a single ticket from database"""
        statement = select(Ticket).where(Ticket.id == ticket_id)

        result = session.exec(statement)

        ticket = result.first()

        if not ticket:
            raise TicketNotFound()

        return ticket

    def get_or_create_customer(self, data: dict, session: Session) -> Customer:
        """
        Retrieves an existing customer or creates a new one based on the provided data.

        Args:
            - data (dict): A dictionary containing customer information.
                Must include either:
                - `customer_id`: ID of an existing customer, or
                - Both `customer_name` and `customer_phone` for creating a new customer.
            - session (Session): SQLAlchemy session object used for database operations.

        Returns:
            Customer: The retrieved or newly created customer object.

        Raises:
            - CustomerNotFound: If the specified `customer_id` does not match any record.
            - HTTPException: If neither `customer_id` nor both `customer_name` and `customer_phone` are provided or if `customer_name` or `customer_phone` are invalid.
        """
        customer_id = data["customer_id"]
        customer_name = data["customer_name"]
        customer_phone = data["customer_phone"]

        if customer_id:
            customer = session.exec(
                select(Customer).where(Customer.id == customer_id)
            ).first()
            if not customer:
                raise CustomerNotFound()
        elif customer_name and customer_phone:
            if not customer_name.strip() or not customer_phone.strip():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Customer name and phone number cannot be empty.",
                )
            customer_data = CustomerCreate(
                name=customer_name, phone_number=customer_phone
            )
            customer = customer_service.create_customer(customer_data, session)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Invalid customer data: Provide either a valid customer ID or both "
                    "a customer name and phone number."
                ),
            )

        return customer

    def create_ticket(self, ticket_data: TicketCreate, user_id: str, session: Session):
        """Create a new ticket record in the database"""
        ticket_data_dict = ticket_data.model_dump()

        # check if owner  exists
        owner = session.exec(
            select(User).where(User.id == ticket_data_dict["owner_id"])
        ).first()

        if not owner:
            raise UserNotFound()

        # get or create customer
        customer = self.get_or_create_customer(ticket_data_dict, session)

        new_ticket = Ticket(**ticket_data_dict)
        new_ticket.creator_id = user_id
        new_ticket.customer_id = customer.id

        session.add(new_ticket)
        session.commit()
        session.refresh(new_ticket)

        return new_ticket

    def update_ticket(
        self, ticket_id: str, update_data: TicketUpdate, session: Session
    ):
        """Update the details of a ticket"""
        ticket_to_update = self.get_ticket(ticket_id, session)

        update_data_dict = update_data.model_dump()

        for field, value in update_data_dict.items():
            setattr(ticket_to_update, field, value)

        session.commit()
        session.refresh(ticket_to_update)

        return ticket_to_update

    def delete_ticket(self, ticket_id: str, session: Session):
        """Delete a single ticket from database"""
        ticket_to_update = self.get_ticket(ticket_id, session)

        session.delete(ticket_to_update)
        session.commit()
