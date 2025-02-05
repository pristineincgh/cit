import jwt
from app.core.config import get_settings
from app.core.security.auth_handler import AuthHandler
from app.core.security.hash_helper import HashHelper
from app.dependencies.notification_service import NotificationService
from app.repository.user_repo import UserRepository
from app.schemas.auth_schema import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResendResetPasswordLinkInput,
    UserInLogin,
    UserLoginResponse,
    UserResetPasswordInput,
    UserResetPasswordResponse,
    UserWithToken,
)
from app.schemas.user_schema import (
    Role,
    UserOutput,
)
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from .base import BaseRepository

settings = get_settings()
JWT_SECRET = settings.JWT.secret
JWT_ALGORITHM = settings.JWT.algo

# initialize notification service
notification = NotificationService()


class AuthRepository(BaseRepository):
    def __init__(self, session: Session):
        super().__init__(session)
        self.user_repo = UserRepository(session)

    async def login_user(self, login_credentials: UserInLogin) -> UserLoginResponse:
        """
        Log in a user.
        """

        # retrieve the user by username
        user = self.user_repo.get_user_by_username_or_email(
            username=login_credentials.username
        )

        # check if the user exists and the password is correct
        if not user or not HashHelper.verify_password(
            login_credentials.password, user.password
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid username or password.",
            )

        if user.login_count == 0:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Please change your password.",
                headers={"x-password-reset": "true"},
            )

        # generate tokens for the user
        tokens = await self.get_token_pair(
            user_id=user.id, username=user.username, user_role=user.role
        )

        if not tokens:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while generating the tokens",
            )

        # update user's login count
        user.login_count += 1
        self.session.commit()
        self.session.refresh(user)

        user_output = UserOutput.model_validate(user)

        return UserLoginResponse(
            access_token=tokens.access_token,
            refresh_token=tokens.refresh_token,
            user=user_output,
        )

    def reset_user_password(
        self, reset_data: UserResetPasswordInput
    ) -> UserResetPasswordResponse:
        # decode the token
        payload = AuthHandler.decode_jwt_token(reset_data.token)
        username = payload.get("username")

        # retrieve the user by username
        user = self.user_repo.get_user_by_username_or_email(username=username)

        # check if the user exists
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        # hash the new password and update the user's password
        hash_pass = HashHelper.get_password_hash(reset_data.new_password)
        user.password = hash_pass
        user.login_count += 1
        self.session.commit()
        self.session.refresh(user)

        return UserResetPasswordResponse(message="Password reset successful.")

    async def resend_reset_password_link(
        self, token_data: ResendResetPasswordLinkInput
    ) -> UserResetPasswordResponse:
        """
        Resend the reset password link to the user.
        """

        token = token_data.token

        payload = jwt.decode(token, options={"verify_signature": False})
        username = payload.get("username")

        # retrieve the user by username
        user = self.user_repo.get_user_by_username_or_email(username=username)

        # check if the user exists
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        # generate verification token for the user
        verification_token = AuthHandler.generate_verification_token(
            username=user.username
        )

        # send email notification to user
        merge_tags = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "username": user.username,
            "reset_link": f"{settings.frontend_url}/reset-password?token={verification_token}",
            "support_email": settings.support_email,
        }

        await notification.send_notification(
            notification_id="new_account_creation",
            email=user.email,
            merge_tags=merge_tags,
            template_id="resend_reset_password",
        )

        return UserResetPasswordResponse(message="Reset password link sent.")

    async def forgot_password(
        self, req_data: ForgotPasswordRequest
    ) -> ForgotPasswordResponse:
        """
        Send the password reset link to the user.
        """

        # retrieve the user by email
        user = self.user_repo.get_user_by_username_or_email(email=req_data.email)

        # check if the user exists
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        # generate verification token for the user
        verification_token = AuthHandler.generate_verification_token(
            username=user.username
        )

        # send email notification to user
        merge_tags = {
            "first_name": user.first_name,
            "last_name": user.last_name,
            "reset_link": f"{settings.frontend_url}/reset-password?token={verification_token}",
            "support_email": settings.support_email,
        }

        await notification.send_notification(
            notification_id="new_account_creation",
            email=user.email,
            merge_tags=merge_tags,
            template_id="forgot_password",
        )

        return ForgotPasswordResponse(message="Reset password link sent.")

    @staticmethod
    async def get_token_pair(
        user_id: str, username: str, user_role: Role
    ) -> UserWithToken:
        """
        Generate a pair of access and refresh tokens.
        """
        token_pair = await AuthHandler.generate_token_pair(user_id, username, user_role)
        return token_pair

    @staticmethod
    async def validate_refresh_token(refresh_token: str) -> str:
        """
        Validate the provided refresh token.
        """
        return await AuthHandler.validate_refresh_token(refresh_token)

    @staticmethod
    async def revoke_token(key: str) -> None:
        """
        Revoke a refresh token.
        """
        pass
