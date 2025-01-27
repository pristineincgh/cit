from typing import Annotated, Optional

import jwt
from fastapi import Depends, Header, HTTPException, status

from app.core.security.auth_handler import AuthHandler
from app.db.database import SessionDep
from app.schemas.user_schema import UserOutput
from app.services.user_service import UserService


def get_user_service(session: SessionDep):
    return UserService(session)


AUTH_PREFIX = "Bearer "


def raise_auth_exception(detail: str = "Missing or invalid authorization header."):
    """Raise an HTTP 401 Unauthorized exception."""
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
    )


async def get_current_user(
    session: UserService = Depends(get_user_service),
    authorization: Annotated[Optional[str], Header()] = None,
) -> UserOutput:
    """Get the current user based on the provided authorization token."""

    if not authorization or not authorization.startswith(AUTH_PREFIX):
        raise_auth_exception()

    token = authorization.removeprefix(AUTH_PREFIX)

    try:
        payload = AuthHandler.decode_jwt_token(token)

        # check if token type is 'access'
        if payload.get("type") != "access":
            raise_auth_exception("Invalid token type. Access token required.")

        user = session.get_user_by_id(payload.get("sub"))
        if not user:
            raise_auth_exception("User not found.")

        return UserOutput(
            id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            username=user.username,
            role=user.role,
            is_active=user.is_active,
            is_verified=user.is_verified,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )
    except jwt.ExpiredSignatureError:
        raise_auth_exception("Access token has expired.")
    except jwt.InvalidTokenError:
        raise_auth_exception("Invalid token.")


def role_required(roles: list):
    """Check if the current user has the required role."""

    def check_role(user: UserOutput = Depends(get_current_user)):
        if user.role not in roles:
            raise_auth_exception(
                "You do not have the required permissions to perform this action."
            )

    return check_role
