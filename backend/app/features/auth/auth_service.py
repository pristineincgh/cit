import logging

from fastapi import HTTPException, status
from sqlmodel import Session, select

from app.utils.api_exceptions import UserAlreadyExists

from .auth_model import User
from .auth_schema import UserCreate
from .auth_utils import generate_passwd_hash


class AuthService:
    def get_user_by_email(self, email: str, session: Session):
        """
        Get user from the database using the email.
        Returns the user if found, otherwise None.
        """
        statement = select(User).where(User.email == email)
        user = session.exec(statement).first()

        # Debugging/logging for clarity
        if not user:
            logging.debug(f"No user found with email: {email}")
        else:
            logging.debug(f"User found: {user.email}")

        return user

    def user_exists(self, email: str, session: Session):
        """
        Check if a user exists in the database by email.
        Returns True if the user exists, otherwise False.
        """
        user = self.get_user_by_email(email, session)
        return user is not None

    def create_user(self, user_data: UserCreate, session: Session):
        if self.user_exists(user_data.email, session):
            raise UserAlreadyExists()

        # Prepare user data
        user_data_dict = user_data.model_dump()
        new_user = User(**user_data_dict)

        # hash the password
        new_user.password_hash = generate_passwd_hash(user_data_dict["password"])

        # add and commit the user
        try:
            session.add(new_user)
            session.commit()
            session.refresh(new_user)  # Refresh to get the latest data from DB
            logging.debug(f"New user created with email: {new_user.email}")

            return new_user
        except Exception as e:
            session.rollback()  # Rollback in case of an error
            logging.error(f"Error creating user: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="An error occurred while creating the user",
            )
