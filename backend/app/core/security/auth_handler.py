from datetime import datetime, timedelta
from uuid import uuid4

import jwt
from app.core.config import get_settings
from app.schemas.auth_schema import UserWithToken

# from app.db.redis import redis_client
from app.schemas.user_schema import Role
from app.utils.token_utils import decode_token
from app.utils.validate_token import validate_token
from fastapi import HTTPException, status

settings = get_settings()

JWT_SECRET = settings.JWT.secret
JWT_ALGORITHM = settings.JWT.algo
ACCESS_TOKEN_EXPIRE_MINUTES = settings.JWT.exp_mins
REFRESH_TOKEN_EXPIRE_DAYS = settings.JWT.exp_days


class AuthHandler:
    @staticmethod
    def create_access_token(
        user_id: str, username: str, user_role: Role, expires_delta: timedelta = None
    ) -> str:
        """
        Create an access token with a unique JWT ID (jti)

        Args:
            - `user_data (dict)`: payload to encode in token
            - `expires_delta` (timedelta): optional token expiration time

        Returns:
            - `str`: JWT token
        """

        to_encode = {
            "sub": user_id,
            "username": username,
            "role": user_role,
            "type": "access",
            "jti": str(uuid4()),
            "iat": datetime.utcnow(),
        }

        expire = datetime.utcnow() + (
            expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        to_encode.update({"exp": expire})

        token = jwt.encode(to_encode, key=JWT_SECRET, algorithm=JWT_ALGORITHM)

        return token

    @staticmethod
    def decode_jwt_token(token: str, refresh: bool = False) -> dict:
        """
        Decode JWT token
        """
        return decode_token(token, refresh=refresh)

    @staticmethod
    async def create_refresh_token(user_id: str) -> str:
        """
        Generate a new refresh token, replace the old one in Redis,
        and return the new token.
        """
        refresh_payload = {
            "sub": user_id,
            "type": "refresh",
            "jti": str(uuid4()),
            "iat": datetime.utcnow(),
        }

        expires_at = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        refresh_payload.update({"exp": expires_at})

        new_refresh_token = jwt.encode(
            refresh_payload, key=JWT_SECRET, algorithm=JWT_ALGORITHM
        )

        return new_refresh_token

    @staticmethod
    async def generate_token_pair(
        user_id: str, username: str, user_role: Role
    ) -> UserWithToken:
        """
        Generate an access token and a refresh token, and store the refresh token in Redis.
        """

        access_token = AuthHandler.create_access_token(user_id, username, user_role)
        refresh_token = await AuthHandler.create_refresh_token(user_id)

        return UserWithToken(access_token=access_token, refresh_token=refresh_token)

    @staticmethod
    async def validate_refresh_token(refresh_token: str) -> str:
        """
        Validate a provided refresh token, blacklist the old token,
        and return new access and refresh tokens.
        """

        try:
            # Decode the provided refresh token
            payload = AuthHandler.decode_jwt_token(refresh_token, refresh=True)
            if not payload or payload.get("type") != "refresh":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token or token type.",
                )

            # Extract user ID and validate existence
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token payload.",
                )

            return payload.get("sub")

        except jwt.ExpiredSignatureError:
            detail = "Refresh token has expired."
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
        except jwt.InvalidTokenError:
            detail = "Invalid refresh token."
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)

    @staticmethod
    async def validate_access_token(access_token: str) -> None:
        """
        Validate the access token to ensure it has not been blacklisted.
        """

        await validate_token(access_token, token_type="access")

    @staticmethod
    def generate_verification_token(username: str, expires_in_hours=1) -> str:
        """
        Generates a JWT token for verification.
        :param username: The user's unique identifier (e.g., username).
        :param expires_in_minutes: Token expiration time in minutes (default is 30 minutes).
        :return: A JWT token as a string.
        """

        payload = {
            "username": username,
            "exp": datetime.utcnow() + timedelta(hours=expires_in_hours),
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

        return token
