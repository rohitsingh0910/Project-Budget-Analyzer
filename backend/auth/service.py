from backend.auth.database import users_collection
import logging

logger = logging.getLogger(__name__)

def login_user(email: str, password: str) -> dict:
    """Authenticate user with email and password"""
    try:
        user = users_collection.find_one({
            "email": email,
            "password": password
        })

        if not user:
            logger.warning(f"Login failed for email: {email}")
            return None

        return {
            "id": str(user["_id"]),
            "name": user.get("name"),
            "email": user.get("email")
        }
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        raise


def signup_user(user_data):
    # Check if email already exists
    existing_user = users_collection.find_one({"email": user_data["email"]})
    if existing_user:
        return {"error": "Email already exists"}

    # Insert new user if email is unique
    result = users_collection.insert_one(user_data)
    return {"success": True, "inserted_id": str(result.inserted_id)}