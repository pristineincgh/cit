from app.core.security.auth_handler import AuthHandler
from app.repository.auth_repo import AuthRepository
from app.schemas.auth_schema import (
    ResendResetPasswordLinkInput,
    UserInLogin,
    UserLoginResponse,
    UserNewTokens,
    UserResetPasswordInput,
    UserResetPasswordResponse,
)
from app.services.user_service import UserService
from fastapi import HTTPException, status
from sqlalchemy.orm import Session


class AuthService:
    def __init__(self, session: Session):
        self._repository = AuthRepository(session)
        self.user_service = UserService(session)

    async def login(self, login_credentials: UserInLogin) -> UserLoginResponse:
        """
        Log in a user.
        """

        return await self._repository.login_user(login_credentials)

    async def refresh_token(
        self,
        refresh_token: str,
    ) -> UserNewTokens:
        """
        Refresh the access token.
        """

        user_id = await self._repository.validate_refresh_token(refresh_token)

        user = self.user_service.get_user_by_id(user_id)

        # generate tokens for the user
        tokens = await self._repository.get_token_pair(
            user_id=user.id, username=user.username, user_role=user.role
        )

        if not tokens:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while generating the tokens",
            )

        return tokens

    async def revoke_token(self, token: str) -> None:
        """
        Revoke a refresh token.
        """

        user_id = await AuthHandler.validate_refresh_token(token)
        key = f"refresh_token:{user_id}"
        await self._repository.revoke_token(key)
        return None

    def reset_password(
        self, reset_data: UserResetPasswordInput
    ) -> UserResetPasswordResponse:
        """
        Reset the user's password.
        """

        return self._repository.reset_user_password(reset_data)

    async def resend_reset_password(
        self, token_data: ResendResetPasswordLinkInput
    ) -> UserResetPasswordResponse:
        """
        Resend the reset password link.
        """

        return await self._repository.resend_reset_password_link(token_data)
