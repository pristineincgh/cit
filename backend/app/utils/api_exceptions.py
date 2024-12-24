from typing import Any

from fastapi import FastAPI, status
from fastapi.requests import Request
from fastapi.responses import JSONResponse


class CustomException(Exception):
    """Base class for all API-related errors."""

    pass


class InvalidToken(CustomException):
    """Raised when the provided token is invalid or expired."""

    pass


class RevokedToken(CustomException):
    """
    Raised when the provided token has been revoked.
    """

    pass


class AccessTokenRequired(CustomException):
    """
    Raised when an access token is required but a refresh token was provided.
    """

    pass


class RefreshTokenRequired(CustomException):
    """
    Raised when a refresh token is required but an access token was provided.
    """

    pass


class UserAlreadyExists(CustomException):
    """
    Raised when attempting to create a user with an email that already exists in the database.
    """

    pass


class InvalidCredentials(CustomException):
    """
    Raised when attempting to login with wrong credentials
    """

    pass


class InsufficientPermission(CustomException):
    """
    Raised when the user lacks the necessary permissions to perform an action.
    """

    pass


class TicketNotFound(CustomException):
    """Raised when the specified ticket cannot be found."""

    pass


class CustomerNotFound(CustomException):
    """Raised when the specified customer cannot be found."""

    pass


class UserNotFound(CustomerNotFound):
    """Raised when the specified user cannot be found."""

    pass


def create_exception_handler(status_code: int, initial_detail: Any):
    async def exception_handler(request: Request, exc):
        return JSONResponse(
            content={
                "message": initial_detail.get("message"),
                "error_code": initial_detail.get("error_code"),
            },
            status_code=status_code,
        )

    return exception_handler


def register_all_errors(app: FastAPI):
    app.add_exception_handler(
        InvalidToken,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "message": "The token is invalid or has expired.",
                "error_code": "INVALID_TOKEN",
            },
        ),
    )

    app.add_exception_handler(
        RevokedToken,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "message": "The token provided has been revoked.",
                "error_code": "TOKEN_REVOKED",
            },
        ),
    )

    app.add_exception_handler(
        AccessTokenRequired,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "message": "Access token is required to access this resource.",
                "error_code": "ACCESS_TOKEN_REQUIRED",
            },
        ),
    )

    app.add_exception_handler(
        RefreshTokenRequired,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "message": "A refresh token is required to proceed.",
                "error_code": "REFRESH_TOKEN_REQUIRED",
            },
        ),
    )

    app.add_exception_handler(
        UserAlreadyExists,
        create_exception_handler(
            status_code=status.HTTP_403_FORBIDDEN,
            initial_detail={
                "message": "A user with this email address already exists.",
                "error_code": "USER_EXISTS",
            },
        ),
    )

    app.add_exception_handler(
        InvalidCredentials,
        create_exception_handler(
            status_code=status.HTTP_400_BAD_REQUEST,
            initial_detail={
                "message": "Invalid email or password provided.",
                "error_code": "INVALID_EMAIL_OR_PASSWORD",
            },
        ),
    )

    app.add_exception_handler(
        InsufficientPermission,
        create_exception_handler(
            status_code=status.HTTP_401_UNAUTHORIZED,
            initial_detail={
                "message": "You do not have the required permissions to perform this action.",
                "error_code": "INSUFFICIENT_PERMISSION",
            },
        ),
    )

    app.add_exception_handler(
        TicketNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "message": "The specified ticket could not be found.",
                "error_code": "TICKET_NOT_FOUND",
            },
        ),
    )

    app.add_exception_handler(
        CustomerNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "message": "The specified customer could not be found.",
                "error_code": "CUSTOMER_NOT_FOUND",
            },
        ),
    )

    app.add_exception_handler(
        UserNotFound,
        create_exception_handler(
            status_code=status.HTTP_404_NOT_FOUND,
            initial_detail={
                "message": "The specified user could not be found.",
                "error_code": "USER_NOT_FOUND",
            },
        ),
    )

    # Global exception handler for 500 - Internal Server Error
    @app.exception_handler(500)
    async def internal_server_error(request, exc):
        return JSONResponse(
            content={
                "error": {
                    "code": "SERVER_ERROR",
                    "message": "An unexpected error occurred on the server.",
                },
                "details": {
                    "resolution": "Please try again later or contact support if the issue persists.",
                },
            },
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
