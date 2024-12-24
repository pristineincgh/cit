from typing import List

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.db.database import SessionDep
from app.db.redis import token_in_blocklist
from app.features.auth.auth_service import AuthService
from app.features.auth.auth_utils import decode_token
from app.utils.api_exceptions import (
    AccessTokenRequired,
    InsufficientPermission,
    InvalidToken,
    RefreshTokenRequired,
    RevokedToken,
)

from .auth_model import User

service = AuthService()


class TokenBearer(HTTPBearer):
    def __init__(self, auto_error=True):
        super().__init__(auto_error=auto_error)

    async def __call__(self, request: Request) -> HTTPAuthorizationCredentials | None:
        """
        Validate the token and return its decoded data.
        """

        credentials = await super().__call__(request)

        token = credentials.credentials

        # Decode and validate the token
        token_data = self.is_token_valid(token)

        if await token_in_blocklist(token_data["jti"]):
            raise RevokedToken()

        self.verify_token_data(token_data)

        return token_data

    def is_token_valid(self, token: str) -> dict:
        """
        Decode the token safely and return its data if valid.
        Raise appropriate HTTP exceptions for known issues.
        """

        token_data = decode_token(token)

        if token_data is None:
            raise InvalidToken()
        return token_data

    def verify_token_data(self, token_data):
        """
        Verify the structure or claims of the token.
        This method must be implemented in subclasses for custom logic.
        """
        raise NotImplementedError("Please overide this method in child class")


class AccessTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        if token_data and token_data["refresh"]:
            raise AccessTokenRequired()


class RefreshTokenBearer(TokenBearer):
    def verify_token_data(self, token_data: dict) -> None:
        if token_data and not token_data["refresh"]:
            raise RefreshTokenRequired()


def get_current_user(
    session: SessionDep, token_details: dict = Depends(AccessTokenBearer())
):
    """Get current logged in user"""

    user_email = token_details["user"]["email"]

    user = service.get_user_by_email(user_email, session)

    return user


class RoleChecker:
    def __init__(self, allowed_roles: List[str]) -> None:
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_user)):
        if current_user.role in self.allowed_roles:
            return True
        raise InsufficientPermission()
