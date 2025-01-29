from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security.auth_handler import AuthHandler
from app.core.security.hash_helper import HashHelper

# from app.db.redis import redis_client
from app.repository.user_repo import UserRepository
from app.schemas.user_schema import (
    UserInCreate,
    UserInLogin,
    UserListResponse,
    UserLoginResponse,
    UserNewTokens,
    UserOutput,
)


class UserService:
    def __init__(self, session: Session):
        self._repository = UserRepository(session)

    def signup(self, user_details: UserInCreate) -> UserOutput:
        """
        Create a new user account.

        Args:
            user_details (UserInCreate): The user details to create the account with.

        Returns:
            UserOutput: The created user account.
        """

        # check if a user with the given username or email already exists
        if self._repository.check_user_exists_by_username_or_email(
            user_details.username, user_details.email
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with the given username or email already exists.",
            )

        # hash the user's password
        user_details.password = HashHelper.get_password_hash(user_details.password)

        # create a new user
        return self._repository.create_user(user_details)

    async def login(self, login_credentials: UserInLogin) -> UserLoginResponse:
        """
        Log in a user.
        """

        # retrieve the user by username
        user = self._repository.get_user_by_username(
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

        # generate tokens for the user
        tokens = await self._repository.get_token_pair(
            user_id=user.id, username=user.username, user_role=user.role
        )

        if not tokens:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while generating the tokens",
            )

        user_output = UserOutput.model_validate(user)

        return UserLoginResponse(
            access_token=tokens.access_token,
            refresh_token=tokens.refresh_token,
            user=user_output,
        )

    def get_all_users(self) -> UserListResponse:
        """
        Retrieve all users.
        """

        return self._repository.all_users()

    def get_user_by_id(self, user_id: str) -> UserOutput:
        """
        Retrieve a user by ID.
        """

        user = self._repository.get_user_by_id(user_id)

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found.",
            )

        return UserOutput.model_validate(user)

    async def refresh_token(
        self,
        refresh_token: str,
    ) -> UserNewTokens:
        """
        Refresh the access token.
        """

        user_id = await self._repository.validate_refresh_token(refresh_token)

        user = self.get_user_by_id(user_id)

        # generate tokens for the user
        tokens = await self._repository.get_token_pair(
            user_id=user.id, username=user.username, user_role=user.role
        )

        if not tokens:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while generating the tokens",
            )

        # # Update refresh token in Redis
        # await redis_client.setex(
        #     f"refresh_token:{user_id}", 604800, tokens.refresh_token
        # )

        return tokens

    async def revoke_token(self, token: str) -> None:
        """
        Revoke a refresh token.
        """

        user_id = await AuthHandler.validate_refresh_token(token)
        key = f"refresh_token:{user_id}"
        await self._repository.revoke_token(key)
        return None
