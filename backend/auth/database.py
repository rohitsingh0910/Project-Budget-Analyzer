from pymongo import MongoClient
from links import MONGO_URI

try:
    client = MongoClient(MONGO_URI)
    db = client.get_database()
    users_collection = db["users"]

    # Test the connection
    users_collection.insert_one({"test": "connection"})
    users_collection.delete_one({"test": "connection"})

except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")
    raise


def create_email_index():
    users_collection.create_index("email", unique=True)
    print("Created unique index on email field")

if __name__ == "__main__":
    create_email_index()