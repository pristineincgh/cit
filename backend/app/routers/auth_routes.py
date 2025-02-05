from app.dependencies.auth_dependency import get_auth_service
from app.dependencies.user_dependency import (
    get_current_user,
)
from app.schemas.auth_schema import (
    ResendResetPasswordLinkInput,
    TokenRefreshRequest,
    UserInLogin,
    UserLoginResponse,
    UserLogout,
    UserNewTokens,
    UserResetPasswordInput,
    UserResetPasswordResponse,
)
from app.schemas.user_schema import UserOutput
from app.services.auth_service import AuthService
from fastapi import APIRouter, Depends, status

auth_router = APIRouter()


@auth_router.post(
    "/login", status_code=status.HTTP_200_OK, response_model=UserLoginResponse
)
async def login_user(
    login_credentials: UserInLogin, service: AuthService = Depends(get_auth_service)
):
    """Log in a user."""

    try:
        return await service.login(login_credentials)
    except Exception as error:
        print(error)
        raise error


@auth_router.get("/me", response_model=UserOutput, status_code=status.HTTP_200_OK)
async def get_user_details(current_user: UserOutput = Depends(get_current_user)):
    """Get the details of the currently authenticated user."""
    return current_user


@auth_router.post(
    "/reset-password",
    response_model=UserResetPasswordResponse,
    status_code=status.HTTP_200_OK,
)
async def reset_user_password(
    data: UserResetPasswordInput, service: AuthService = Depends(get_auth_service)
):
    """Reset a user's password."""

    try:
        return service.reset_password(data)
    except Exception as error:
        print(error)
        raise error


@auth_router.post(
    "/resend-reset-password",
    response_model=UserResetPasswordResponse,
    status_code=status.HTTP_200_OK,
)
async def resend_reset_password(
    token_data: ResendResetPasswordLinkInput,
    service: AuthService = Depends(get_auth_service),
):
    """Resend the reset password email."""

    try:
        return await service.resend_reset_password(token_data)
    except Exception as error:
        print(error)
        raise error


@auth_router.post(
    "/refresh", response_model=UserNewTokens, status_code=status.HTTP_200_OK
)
async def refresh_access_token(
    token_request: TokenRefreshRequest,
    service: AuthService = Depends(get_auth_service),
):
    """
    Refresh the access token.
    Get a new access token and refresh token using the provided refresh token.
    """
    return await service.refresh_token(token_request.refresh_token)


@auth_router.post("/logout", response_model=UserLogout, status_code=status.HTTP_200_OK)
async def logout_user(
    refresh_token: str, service: AuthService = Depends(get_auth_service)
):
    """Log out a user."""
    service.revoke_token(refresh_token)
    return {"message": "Logged out successfully"}
