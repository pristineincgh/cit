from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class Role(str, Enum):
    """
    This enum class is used to define the user role.

    The role can be one of the following:
    - superadmin
    - admin
    - agent
    """

    SUPERADMIN = "superadmin"
    ADMIN = "admin"
    AGENT = "agent"


class UserInCreate(BaseModel):
    """
    This class is used to validate the user data when creating a new user.
    """

    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    username: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=50)
    role: Role = Role.AGENT


class UserOutput(BaseModel):
    """
    This class is used to return the user data when creating a new user.
    """

    id: str
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    role: Role
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserInUpdate(BaseModel):
    """
    This class is used to validate the user data when updating a user.
    """

    id: str
    first_name: Optional[str] = Field(None, min_length=2, max_length=50)
    last_name: Optional[str] = Field(None, min_length=2, max_length=50)
    username: Optional[str] = Field(None, min_length=2, max_length=50)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8, max_length=50)
    role: Optional[Role] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None


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


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class UserNewTokens(UserWithToken):
    """
    This class is used to return a new access token after a successful refresh.
    """


class UserLogout(BaseModel):
    """
    This class is used to send success response.
    """

    message: str
