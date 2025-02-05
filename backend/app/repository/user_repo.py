from typing import Optional

from app.core.config import get_settings
from app.core.security.auth_handler import AuthHandler
from app.core.security.hash_helper import HashHelper
from app.db.models.user_model import User
from app.dependencies.notification_service import NotificationService
from app.schemas.user_schema import (
    UserInCreate,
    UserInUpdate,
    UserListResponse,
    UserOutput,
)
from app.utils.generate_password import generate_password
from fastapi import HTTPException, status

from .base import BaseRepository

settings = get_settings()
JWT_SECRET = settings.JWT.secret
JWT_ALGORITHM = settings.JWT.algo

# initialize notification service
notification = NotificationService()


class UserRepository(BaseRepository):
    def check_user_exists_by_username_or_email(self, username: str, email: str) -> bool:
        """
        Check if a user with the given username or email
        already exists in the database.
        """
        return (
            self.session.query(User)
            .filter(User.username == username or User.email == email)
            .first()
            is not None
        )

    async def create_user(self, user_data: UserInCreate) -> UserOutput:
        """
        Create a new user in the database.
        """

        # check if a user with the given username or email already exists
        if self.check_user_exists_by_username_or_email(
            user_data.username, user_data.email
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with the given username or email already exists.",
            )

        # hash the user's password
        default_password = generate_password()
        hash_pass = HashHelper.get_password_hash(default_password)

        new_user_data = {
            "first_name": user_data.first_name,
            "last_name": user_data.last_name,
            "email": user_data.email,
            "username": user_data.username,
            "password": hash_pass,
            "role": user_data.role,
        }

        # create a new user
        new_user = User(**new_user_data)

        # generate verification token for the user
        verification_token = AuthHandler.generate_verification_token(
            username=user_data.username
        )

        # send email notification to user
        merge_tags = {
            "first_name": new_user.first_name,
            "last_name": new_user.last_name,
            "username": new_user.username,
            "default_password": default_password,
            "reset_link": f"{settings.frontend_url}/reset-password?token={verification_token}",
            "support_email": settings.support_email,
        }

        await notification.send_notification(
            notification_id="new_account_creation",
            email=new_user.email,
            merge_tags=merge_tags,
        )

        self.session.add(new_user)
        self.session.commit()
        self.session.refresh(new_user)

        return UserOutput(
            id=new_user.id,
            first_name=new_user.first_name,
            last_name=new_user.last_name,
            username=new_user.username,
            email=new_user.email,
            role=new_user.role,
            login_count=new_user.login_count,
            is_active=new_user.is_active,
            created_at=new_user.created_at,
            updated_at=new_user.updated_at,
        )

    def get_user_by_username_or_email(
        self, username: Optional[str] = None, email: Optional[str] = None
    ) -> User:
        """
        Retrieve a user by username or email.
        """
        query = self.session.query(User)

        if username is not None:
            query = query.filter(User.username == username)
        elif email is not None:
            query = query.filter(User.email == email)
        else:
            return None  # Return None if neither username nor email is provided

        return query.first()

    def get_user_by_id(self, user_id: str) -> User:
        """
        Retrieve a user by ID.
        """
        return self.session.query(User).filter(User.id == user_id).first()

    def all_users(self) -> UserListResponse:
        """
        Retrieve all users.
        """
        users = self.session.query(User).all()

        # order users by created_at in descending order
        users = sorted(users, key=lambda x: x.created_at, reverse=True)

        total = len(users)
        return UserListResponse(
            total=total,
            users=[
                UserOutput(
                    id=user.id,
                    first_name=user.first_name,
                    last_name=user.last_name,
                    username=user.username,
                    email=user.email,
                    role=user.role,
                    login_count=user.login_count,
                    is_active=user.is_active,
                    created_at=user.created_at,
                    updated_at=user.updated_at,
                )
                for user in users
            ],
        )

    def update_my_profile(
        self, user_details: UserInUpdate, current_user: UserOutput
    ) -> UserOutput:
        """
        Update the current user's profile.
        """

        try:
            user = self.get_user_by_id(current_user.id)

            if not user:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User not found.",
                )

            updated_data = user_details.model_dump(exclude_unset=True)

            # Handle password hashing if it's being updated
            if "password" in updated_data:
                updated_data["password"] = HashHelper.get_password_hash(
                    updated_data["password"]
                )

            for key, value in updated_data.items():
                setattr(user, key, value)

            self.session.commit()
            self.session.refresh(user)

            return UserOutput.model_validate(user)
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to update user: {str(error)}",
            )
