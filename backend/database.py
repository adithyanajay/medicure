# from motor.motor_asyncio import AsyncIOMotorClient
# import os
# from dotenv import load_dotenv

# load_dotenv()

# MONGO_URI = os.getenv("MONGO_URI")
# DB_NAME = "medicure"

# client = AsyncIOMotorClient(MONGO_URI)
# db = client[DB_NAME]



import motor.motor_asyncio
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB connection string from .env
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = "medicure"  # Change to your database name
USER_COLLECTION = "users"

# Initialize MongoDB Client
client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)

# Reference to the database
db = client[DATABASE_NAME]

# Reference to collections (like tables in SQL)
users_collection = db[USER_COLLECTION]


async def check_db_connection():
    """Check MongoDB connection on startup."""
    try:
        await client.admin.command("ping")  # Ping the database
        print("✅ MongoDB Connection Successful!")
        
        # Ensure the 'users' collection exists
        existing_collections = await db.list_collection_names()
        if USER_COLLECTION not in existing_collections:
            await db.create_collection(USER_COLLECTION)
            print(f"📌 Collection '{USER_COLLECTION}' created.")

    except ConnectionFailure:
        print("❌ Failed to connect to MongoDB. Check your MONGO_URI.")



async def get_user_collection():
    return db["users"]


async def get_user_profile_collection():
    return db["user_profiles"]