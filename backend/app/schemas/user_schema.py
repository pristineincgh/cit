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
    login_count: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserListResponse(BaseModel):
    """
    This class is used to return the list of users.
    """

    total: int
    users: list[UserOutput]

    model_config = {"from_attributes": True}


class UserInUpdate(BaseModel):
    """
    This class is used to validate the user data when updating a user.
    """

    first_name: Optional[str] = Field(None, min_length=2, max_length=50)
    last_name: Optional[str] = Field(None, min_length=2, max_length=50)
    username: Optional[str] = Field(None, min_length=2, max_length=50)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8, max_length=50)
    role: Optional[Role] = None
    is_active: Optional[bool] = None
