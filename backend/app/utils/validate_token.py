import jwt
from fastapi import HTTPException, status

from app.utils.token_utils import decode_token


async def validate_token(token: str, token_type: str) -> dict:
    """
    Validate a JWT token (either access or refresh) and ensure it meets requirements.
    """

    try:
        payload = decode_token(token, refresh=(token_type == "refresh"))

        # Ensure the token type matches
        if payload.get("type") != token_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid token type. {token_type.capitalize()} token required.",
            )

        # Additional checks for refresh tokens
        if token_type == "refresh":
            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid refresh token.",
                )

        return payload

    except jwt.ExpiredSignatureError:
        detail = f"{token_type.capitalize()} token has expired."
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
    except jwt.InvalidTokenError:
        detail = f"Invalid {token_type} token."
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
