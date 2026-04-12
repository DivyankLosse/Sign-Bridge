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
    """Ensure required indexes exist for performance optimization in an idempotent way."""
    try:
        # Check existing user indexes
        user_indexes = db.users.index_information()
        if "unique_email_idx" not in user_indexes:
            db.users.create_index("email", unique=True, name="unique_email_idx")
            logging.info("Created unique_email_idx for users collection.")
        
        # Check existing history indexes
        history_indexes = db.history.index_information()
        if "user_history_idx" not in history_indexes:
            db.history.create_index([("user_id", 1), ("created_at", -1)], name="user_history_idx")
            logging.info("Created user_history_idx for history collection.")
            
        logging.info("MongoDB indexes verified.")
    except Exception as e:
        logging.warning(f"Failed to verify/create indexes: {e}")

# Call on startup
ensure_indexes()

# Dependency for FastAPI
def get_db():
    try:
        yield db
    finally:
        pass  # MongoClient handles pooling, no need to manually close per request
