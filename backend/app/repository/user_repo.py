from app.core.security.auth_handler import AuthHandler
from app.db.models.user_model import User
from app.schemas.user_schema import Role, UserInCreate, UserOutput, UserWithToken

from .base import BaseRepository


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

    def create_user(self, user_data: UserInCreate) -> UserOutput:
        """
        Create a new user in the database.
        """

        # create a new user
        new_user = User(**user_data.model_dump(exclude_none=True))

        self.session.add(new_user)
        self.session.commit()
        self.session.refresh(new_user)

        return UserOutput.model_validate(new_user)

    def get_user_by_username(self, username: str) -> User:
        """
        Retrieve a user by username.
        """
        return self.session.query(User).filter(User.username == username).first()

    def get_user_by_id(self, user_id: str) -> User:
        """
        Retrieve a user by ID.
        """
        return self.session.query(User).filter(User.id == user_id).first()

    def all_users(self):
        return self.session.query(User).all()

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

    # @staticmethod
    # async def revoke_token(key: str) -> None:
    #     """
    #     Revoke a refresh token.
    #     """
    #     await redis_client.delete(key)
