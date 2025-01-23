import jwt
from fastapi import HTTPException, status

from app.core.config import get_settings

settings = get_settings()
JWT_SECRET = settings.JWT.secret
JWT_ALGORITHM = settings.JWT.algo


def decode_token(token: str, refresh: bool = False) -> dict:
    """
    Decode a JWT token and validate its expiration.
    """
    try:
        payload = jwt.decode(token, key=JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        detail = (
            "Refresh token has expired." if refresh else "Access token has expired."
        )
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
    except jwt.InvalidTokenError:
        detail = (
            "Invalid refresh token from decode func."
            if refresh
            else "Invalid access token."
        )
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
