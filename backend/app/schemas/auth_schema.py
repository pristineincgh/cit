from app.schemas.user_schema import UserOutput
from pydantic import BaseModel, EmailStr, Field


class UserInLogin(BaseModel):
    """
    This class is used to validate the user data when logging in.
    """

    username: str = Field(..., min_length=2, max_length=50)
    password: str = Field(..., min_length=8, max_length=50)


class UserWithToken(BaseModel):
    """
    This class is used to return access and refresh tokens after a successful login.
    """

    access_token: str
    refresh_token: str


class UserLoginResponse(UserWithToken):
    """
    This class is used to return access and refresh tokens after a successful login.
    """

    user: UserOutput


class UserNewTokens(UserWithToken):
    """
    This class is used to return a new access token after a successful refresh.
    """


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class UserResetPasswordInput(BaseModel):
    """
    This class is used to validate the user data when resetting the password.
    """

    token: str
    new_password: str = Field(..., min_length=8, max_length=50)


class UserLogout(BaseModel):
    """
    This class is used to send success response.
    """

    message: str


class UserResetPasswordResponse(UserLogout):
    """
    This class is used to send success response.
    """


class ResendResetPasswordLinkInput(BaseModel):
    """
    This class is used to validate the user data when resending the reset password link.
    """

    token: str


class ForgotPasswordRequest(BaseModel):
    """
    This class is used to validate the user data when requesting a password reset.
    """

    email: EmailStr


class ForgotPasswordResponse(UserLogout):
    """
    This class is used to send success response.
    """
