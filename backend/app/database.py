from pymongo import MongoClient
from app.config import settings
import logging

MONGO_URI = getattr(settings, "MONGO_URI", "mongodb+srv://DivyankLoose:aRvTSpXrBS53TbyR@sign-bridge.jkw6tfc.mongodb.net/")

import certifi

# Configure the single Mongo client for the app
try:
    client = MongoClient(
        MONGO_URI, 
        serverSelectionTimeoutMS=5000,
        tlsCAFile=certifi.where()
    )
    db = client.get_database("sign_bridge")
except Exception as e:
    logging.error(f"Failed to connect to MongoDB: {e}")
    raise e

def ensure_indexes():
    """Ensure required indexes exist for performance optimization."""
    try:
        # Index for faster login/signup lookups
        db.users.create_index("email", unique=True)
        # Index for history lookups
        db.history.create_index([("user_id", 1), ("created_at", -1)])
        logging.info("MongoDB indexes verified/created.")
    except Exception as e:
        logging.warning(f"Failed to create indexes (might already exist or have duplicates): {e}")

# Call on startup
ensure_indexes()

# Dependency for FastAPI
def get_db():
    try:
        yield db
    finally:
        pass  # MongoClient handles pooling, no need to manually close per request
