from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repository.customer_repo import CustomerRepository
from app.schemas.customer_schema import (
    CustomerInCreate,
    CustomerListResponse,
    CustomerOut,
)


class CustomerService:
    def __init__(self, session: Session):
        self._repository = CustomerRepository(session)

    def create_customer(self, customer_data: CustomerInCreate) -> CustomerOut:
        """
        Create a new customer.
        """

        # check if a customer with the given phone number already exists
        if self._repository.check_customer_exists_by_phone_number(
            customer_data.phone_number
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A customer with the given phone number already exists.",
            )

        # create a new customer
        return self._repository.create_customer(customer_data)

    def get_all_customers(self) -> CustomerListResponse:
        """
        Retrieve all customers.
        """
        return self._repository.all_customers()

    def get_customer_by_id(self, customer_id: str) -> CustomerOut:
        """
        Retrieve a customer by ID.
        """
        customer = self._repository.get_customer_by_id(customer_id)

        if not customer:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Customer not found.",
            )

        return customer
