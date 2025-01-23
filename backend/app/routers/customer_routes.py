from fastapi import APIRouter, Depends, status

from app.db.database import SessionDep
from app.dependencies.user_dependency import get_current_user
from app.schemas.customer_schema import (
    CustomerInCreate,
    CustomerListResponse,
    CustomerOut,
)
from app.services.customer_service import CustomerService


def get_customer_service(session: SessionDep) -> CustomerService:
    return CustomerService(session)


router = APIRouter()


@router.post(
    "/customers",
    response_model=CustomerOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_user)],
)
async def create_customer(
    customer_data: CustomerInCreate,
    service: CustomerService = Depends(get_customer_service),
):
    """Create a new customer."""

    try:
        return service.create_customer(customer_data)
    except Exception as error:
        raise error


@router.get(
    "/customers",
    response_model=CustomerListResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(get_current_user)],
)
async def get_customers(service: CustomerService = Depends(get_customer_service)):
    """Retrieve all customers."""

    try:
        return service.get_all_customers()
    except Exception as error:
        raise error


@router.get(
    "/customers/{customer_id}",
    response_model=CustomerOut,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(get_current_user)],
)
async def get_customer_by_id(
    customer_id: str, service: CustomerService = Depends(get_customer_service)
):
    """Get a customer by ID."""

    try:
        return service.get_customer_by_id(customer_id)
    except Exception as error:
        raise error
