from datetime import datetime

from pydantic import BaseModel


class CustomerInCreate(BaseModel):
    """
    This class is used to validate the customer data when creating a new customer.
    """

    name: str
    phone_number: str


class CustomerOut(BaseModel):
    """
    This class is used to return the customer data when creating a new customer.
    """

    id: str
    name: str
    phone_number: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CustomerInUpdate(BaseModel):
    """
    This class is used to validate the customer data when updating a customer.
    """

    id: str
    name: str
    phone_number: str


class CustomerOutWithTickets(CustomerOut):
    """
    This class is used to return the customer data.
    This class includes the tickets associated with the customer.
    """

    tickets: list[dict]
    model_config = {"from_attributes": True}


class CustomerListResponse(BaseModel):
    """
    This class is used to return the list of customers.
    """

    total: int
    customers: list[CustomerOut]

    model_config = {"from_attributes": True}
