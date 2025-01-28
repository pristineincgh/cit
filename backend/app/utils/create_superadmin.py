from sqlalchemy.orm import Session
from app.db.models import User
from app.db.database import SessionLocal
from app.services.user_service import UserService
from app.schemas.user_schema import Role, UserInCreate
from app.core.config import get_settings

settings = get_settings()

async def create_superadmin_if_not_exists():
    # Initialize a database session
    with SessionLocal() as db:
        # Manually initialize UserService with the database session
        service = UserService(session=db)
        
        # Check if superadmin exists
        superadmin = db.query(User).filter(User.role == Role.SUPERADMIN).first()
        if superadmin:
            print("Superadmin already exists")
            return

        # Create superadmin if not exists
        user_data = UserInCreate(
            first_name="Pristine",
            last_name="Superadmin",
            username="superadmin",
            email="admin@pristineincgh.com",
            password=settings.admin_password,  # Ensure this is a secure hashed password
            role=Role.SUPERADMIN,
        )

        try:
            # Use the UserService to sign up the superadmin
            service.signup(user_data)
            print("Superadmin created")
        except Exception as error:
            print(f"Error creating superadmin: {error}")
