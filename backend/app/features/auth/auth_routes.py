from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse

from app.db.database import SessionDep
from app.db.redis import add_jti_to_blocklist
from app.utils.api_exceptions import InvalidCredentials, InvalidToken

from .auth_dependencies import (
    AccessTokenBearer,
    RefreshTokenBearer,
    RoleChecker,
    get_current_user,
)
from .auth_schema import (
    UserCreate,
    UserLogin,
    UserPublic,
    UserPublicWithTickets,
)
from .auth_service import AuthService
from .auth_utils import create_access_token, verify_passwd

router = APIRouter()
service = AuthService()
role_checker = RoleChecker(["admin", "user"])

REFRESH_TOKEN_EXPIRY = 2

AccessTokenDep = Depends(AccessTokenBearer())
RefreshTokenDep = Depends(RefreshTokenBearer())


@router.post("/signup", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def create_user_account(user_data: UserCreate, session: SessionDep):
    new_user = service.create_user(user_data, session)

    return new_user


@router.post("/login")
async def login_user(login_data: UserLogin, session: SessionDep):
    email = login_data.email
    password = login_data.password

    # Attempt to retrieve the user from the database
    user = service.get_user_by_email(email, session)

    if user is None:
        raise InvalidCredentials()

    # Validate the password
    if not verify_passwd(password, user.password_hash):
        raise InvalidCredentials()

    # Generate access and refresh tokens
    access_token = create_access_token(
        user_data={
            "user_id": str(user.id),
            "firstname": user.firstname,
            "lastname": user.lastname,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
    )

    refresh_token = create_access_token(
        user_data={
            "user_id": str(user.id),
            "firstname": user.firstname,
            "lastname": user.lastname,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        },
        refresh=True,
        expiry=timedelta(days=REFRESH_TOKEN_EXPIRY),
    )

    # Return a successful response with tokens and user info
    return JSONResponse(
        content={
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "user_id": str(user.id),
                "firstname": user.firstname,
                "lastname": user.lastname,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            },
        }
    )


@router.get("/refresh_token")
async def get_new_access_token(token_details: dict = RefreshTokenDep):
    """Get New Access Token using the refresh token"""

    expiry_timestamp = token_details["exp"]

    if datetime.fromtimestamp(expiry_timestamp) > datetime.now():
        new_access_token = create_access_token(user_data=token_details["user"])

        return JSONResponse(content={"access_token": new_access_token})
    raise InvalidToken()


@router.get("/me", response_model=UserPublicWithTickets)
async def get_current_user(
    user=Depends(get_current_user), _: bool = Depends(role_checker)
):
    return user


@router.get("/logout")
async def revoke_token(token_details: dict = AccessTokenDep):
    jti = token_details["jti"]

    await add_jti_to_blocklist(jti)

    return JSONResponse(
        content={"message": "Logged out successfully"}, status_code=status.HTTP_200_OK
    )
