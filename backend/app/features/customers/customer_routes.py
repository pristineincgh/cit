from typing import List

from fastapi import APIRouter, Depends, status

from app.db.database import SessionDep

from ..auth.auth_dependencies import AccessTokenBearer, RoleChecker
from .customer_schema import (
    CustomerCreate,
    CustomerPublic,
    CustomerPublicWithTickets,
    CustomerUpdate,
)
from .customer_service import CustomerService

# role checkers
universal_checker = Depends(RoleChecker(["admin", "user"]))
admin_checker = Depends(RoleChecker(["admin"]))

# from app.utils import is_valid_uuid

router = APIRouter()
service = CustomerService()

TokenDep = Depends(AccessTokenBearer())


@router.get(
    "/",
    response_model=List[CustomerPublic],
    status_code=status.HTTP_200_OK,
    dependencies=[universal_checker],
)
async def get_all_customers(session: SessionDep, token_details=TokenDep):
    """Retrieve all books"""

    customers = service.get_all_customers(session)
    return customers


@router.post(
    "/",
    response_model=CustomerPublic,
    status_code=status.HTTP_201_CREATED,
    dependencies=[universal_checker],
)
async def create_customer(
    customer_data: CustomerCreate,
    session: SessionDep,
    token_details=TokenDep,
):
    """Create a new customer"""
    new_customer = service.create_customer(customer_data, session)
    return new_customer


@router.get(
    "/{customer_id}",
    response_model=CustomerPublicWithTickets,
    status_code=status.HTTP_200_OK,
    dependencies=[universal_checker],
)
async def get_customer(
    customer_id: str,
    session: SessionDep,
    token_details=TokenDep,
):
    """Retrieve a single customer by ID"""
    customer = service.get_customer(customer_id, session)
    return customer


@router.put(
    "/{customer_id}",
    response_model=CustomerPublic,
    status_code=status.HTTP_200_OK,
    dependencies=[universal_checker],
)
async def update_customer(
    customer_id: str,
    customer_data: CustomerUpdate,
    session: SessionDep,
    token_details=TokenDep,
):
    """Update details of a single customer"""
    updated_customer = service.update_customer(customer_id, customer_data, session)
    return updated_customer


@router.delete(
    "/{customer_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[admin_checker],
)
async def delete_customer(
    customer_id: str,
    session: SessionDep,
    token_details=TokenDep,
):
    """Delete a customer"""
    service.delete_customer(customer_id, session)
