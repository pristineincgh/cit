from app.core.config import get_settings
from app.core.security.hash_helper import HashHelper
from app.db.database import SessionLocal
from app.db.models.user_model import User
from app.schemas.user_schema import Role, UserInCreate

settings = get_settings()


async def create_superadmin_if_not_exists():
    # Initialize a database session
    with SessionLocal() as db:

        try:
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
                email="admin@pristineincgh.com",  # Ensure this is a secure hashed password
                role=Role.SUPERADMIN,
            )

            # Hash the user's password
            hash_pass = HashHelper.get_password_hash(settings.admin_password)

            new_user_data = {
                "first_name": user_data.first_name,
                "last_name": user_data.last_name,
                "email": user_data.email,
                "username": user_data.username,
                "password": hash_pass,
                "role": user_data.role,
                "login_count": 1,
            }

            # Create a new superadmin
            new_user = User(**new_user_data)
            db.add(new_user)
            db.commit()
            db.refresh(new_user)

            print("Superadmin created")
        except Exception as error:
            print(f"Error creating superadmin: {error}")
