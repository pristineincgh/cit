from fastapi import APIRouter, Depends, status

from app.dependencies.user_dependency import (
    get_current_user,
    get_user_service,
    role_required,
)
from app.schemas.user_schema import (
    Role,
    TokenRefreshRequest,
    UserInCreate,
    UserInLogin,
    UserLoginResponse,
    UserLogout,
    UserNewTokens,
    UserOutput,
)
from app.services.user_service import UserService

auth_router = APIRouter()


@auth_router.post(
    "/login", status_code=status.HTTP_200_OK, response_model=UserLoginResponse
)
async def login_user(
    login_credentials: UserInLogin, service: UserService = Depends(get_user_service)
):
    """Log in a user."""

    try:
        return await service.login(login_credentials)
    except Exception as error:
        print(error)
        raise error


@auth_router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED,
    response_model=UserOutput,
    dependencies=[Depends(role_required([Role.ADMIN, Role.SUPERADMIN]))],
)
async def create_user_account(
    signup_data: UserInCreate, service: UserService = Depends(get_user_service)
):
    """Create a new user account."""

    try:
        return service.signup(signup_data)
    except Exception as error:
        print(error)
        raise error


@auth_router.get("/me", response_model=UserOutput, status_code=status.HTTP_200_OK)
async def get_user_details(current_user: UserOutput = Depends(get_current_user)):
    """Get the details of the currently authenticated user."""
    return current_user


@auth_router.get(
    "/users",
    response_model=list[UserOutput],
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(role_required([Role.ADMIN, Role.SUPERADMIN]))],
)
async def get_all_users(
    current_user: UserOutput = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
):
    """Get all users"""
    return service.get_all_users()


@auth_router.post(
    "/refresh", response_model=UserNewTokens, status_code=status.HTTP_200_OK
)
async def refresh_access_token(
    token_request: TokenRefreshRequest,
    service: UserService = Depends(get_user_service),
):
    """
    Refresh the access token.
    Get a new access token and refresh token using the provided refresh token.
    """
    return await service.refresh_token(token_request.refresh_token)


@auth_router.post("/logout", response_model=UserLogout, status_code=status.HTTP_200_OK)
async def logout_user(
    refresh_token: str, service: UserService = Depends(get_user_service)
):
    """Log out a user."""
    service.revoke_token(refresh_token)
    return {"message": "Logged out successfully"}
