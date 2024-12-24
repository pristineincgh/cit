from sqlmodel import Session, desc, select

from app.utils.api_exceptions import CustomerNotFound

from .customer_model import Customer
from .customer_schema import CustomerCreate, CustomerUpdate


class CustomerService:
    def get_all_customers(self, session: Session):
        """Retrieve all customers from database"""
        statement = select(Customer).order_by(desc(Customer.created_at))
        result = session.exec(statement)

        return result.all()

    def get_customer(self, customer_id: str, session: Session):
        """Retrieve a single customer from database"""
        statement = select(Customer).where(Customer.id == customer_id)

        result = session.exec(statement)

        customer = result.first()

        if not customer:
            raise CustomerNotFound()

        return customer

    def create_customer(self, customer_data: CustomerCreate, session: Session):
        """Create a new customer record in the database"""
        customer_data_dict = customer_data.model_dump()

        new_customer = Customer(**customer_data_dict)
        session.add(new_customer)
        session.commit()

        return new_customer

    def update_customer(
        self, customer_id: str, update_data: CustomerUpdate, session: Session
    ):
        """Update the details of a customer"""
        customer_to_update = self.get_customer(customer_id, session)

        update_data_dict = update_data.model_dump()

        for field, value in update_data_dict.items():
            setattr(customer_to_update, field, value)

        session.commit()

        return customer_to_update

    def delete_customer(self, customer_id: str, session: Session):
        """Delete a single customer from database"""
        customer_to_update = self.get_customer(customer_id, session)

        session.delete(customer_to_update)
        session.commit()
