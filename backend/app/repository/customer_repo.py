from fastapi import HTTPException, status
from app.db.models.customer_model import Customer
from app.schemas.customer_schema import (
    CustomerInCreate,
    CustomerListResponse,
    CustomerOut,
)

from .base import BaseRepository


class CustomerRepository(BaseRepository):
    def check_customer_exists_by_phone_number(self, phone_number: str) -> bool:
        """
        Check if a customer with the given phone number
        already exists in the database.
        """
        return (
            self.session.query(Customer)
            .filter(Customer.phone_number == phone_number)
            .first()
            is not None
        )

    def create_customer(self, customer_data: CustomerInCreate) -> CustomerOut:
        """
        Create a new customer in the database.
        """

        # create a new customer
        new_customer = Customer(**customer_data.model_dump(exclude_none=True))

        self.session.add(new_customer)
        self.session.commit()
        self.session.refresh(new_customer)

        return CustomerOut.model_validate(new_customer)

    def all_customers(self) -> CustomerListResponse:
        """
        Retrieve all customers.
        """
        customers = self.session.query(Customer).all()

        # order customers by updated_at in descending order
        customers = sorted(customers, key=lambda x: x.created_at, reverse=True)

        total = len(customers)
        return CustomerListResponse(
            total=total,
            customers=[
                CustomerOut(
                    id=customer.id,
                    name=customer.name,
                    phone_number=customer.phone_number,
                    created_at=customer.created_at,
                    updated_at=customer.updated_at,
                )
                for customer in customers
            ],
        )

    def get_customer_by_id(self, customer_id: str) -> Customer:
        """
        Retrieve a customer by ID.
        """
        return self.session.query(Customer).filter(Customer.id == customer_id).first()
    
    def update_customer(self, customer_id: str, customer_data: CustomerInCreate) -> CustomerOut:
        """
        Update a customer by ID.
        """
        
        # check if a customer with the given ID exists
        customer = self.get_customer_by_id(customer_id)

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Customer with ID {customer_id} not found.",
            )
        
        # update the customer
        updated_customer = customer_data.model_dump(exclude_none=True)
        for key, value in updated_customer.items():
            setattr(customer, key, value)

        self.session.commit()
        self.session.refresh(customer)

        return CustomerOut.model_validate(customer)
    
    def delete_customer(self, customer_id: str) -> None:
        """
        Delete a customer by ID.
        """

        # check if a customer with the given ID exists
        customer = self.get_customer_by_id(customer_id)

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Customer with ID {customer_id} not found.",
            )

        self.session.delete(customer)
        self.session.commit()

