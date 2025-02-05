from app.dependencies.user_dependency import (
    get_current_user,
    get_user_service,
    role_required,
)
from app.schemas.user_schema import (
    Role,
    UserInCreate,
    UserInUpdate,
    UserListResponse,
    UserOutput,
)
from app.services.user_service import UserService
from fastapi import APIRouter, Depends, status

user_router = APIRouter()


@user_router.get(
    "/users",
    response_model=UserListResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(role_required([Role.ADMIN, Role.SUPERADMIN]))],
)
async def get_all_users(
    current_user: UserOutput = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
):
    """Get all users"""
    return service.get_all_users()


@user_router.post(
    "/users",
    status_code=status.HTTP_201_CREATED,
    response_model=UserOutput,
    dependencies=[Depends(role_required([Role.ADMIN, Role.SUPERADMIN]))],
)
async def create_user_account(
    user_details: UserInCreate, service: UserService = Depends(get_user_service)
):
    """Create a new user account."""

    try:
        return await service.create_new_user(user_details)
    except Exception as error:
        print(error)
        raise error


@user_router.patch(
    "/users/me", response_model=UserOutput, status_code=status.HTTP_200_OK
)
async def update_user_details(
    user_details: UserInUpdate,
    current_user: UserOutput = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
):
    """Update the details of the currently authenticated user."""

    try:
        return service.update_current_user(user_details, current_user)
    except Exception as error:
        print(error)
        raise error
