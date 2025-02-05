# from app.db.redis import redis_client
from app.repository.user_repo import UserRepository
from app.schemas.user_schema import (
    UserInCreate,
    UserInUpdate,
    UserListResponse,
    UserOutput,
)
from fastapi import HTTPException, status
from sqlalchemy.orm import Session


class UserService:
    def __init__(self, session: Session):
        self._repository = UserRepository(session)

    async def create_new_user(self, user_details: UserInCreate) -> UserOutput:
        """
        Create a new user account.
        """

        return await self._repository.create_user(user_details)

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

    def update_current_user(self, user_details: UserInUpdate, current_user: UserOutput):
        """
        Update the details of the currently authenticated user.
        """

        return self._repository.update_my_profile(user_details, current_user)
