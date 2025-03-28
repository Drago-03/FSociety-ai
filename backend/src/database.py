from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient
from typing import Generator
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# PostgreSQL Configuration
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "content_moderation")

SQLALCHEMY_DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
MONGO_DB = os.getenv("MONGO_DB", "content_moderation")

mongo_client = MongoClient(MONGO_URI)
mongo_db = mongo_client[MONGO_DB]

# Database dependency
def get_db() -> Generator:
    """
    Get database session.
    """
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_mongo_collection(collection_name: str):
    """
    Get MongoDB collection.
    """
    return mongo_db[collection_name]

# Initialize databases
def init_db() -> None:
    """
    Initialize database tables and indexes.
    """
    Base.metadata.create_all(bind=engine)
    
    # Create MongoDB indexes
    analysis_collection = mongo_db.analysis_results
    analysis_collection.create_index([("created_at", 1)])
    analysis_collection.create_index([("user_id", 1)])
    
    training_collection = mongo_db.training_results
    training_collection.create_index([("model_version", 1)])
    training_collection.create_index([("created_at", 1)])

# Health check
def check_db_connection() -> bool:
    """
    Check database connections.
    """
    try:
        # Check PostgreSQL
        with engine.connect() as connection:
            connection.execute("SELECT 1")
        
        # Check MongoDB
        mongo_client.admin.command('ping')
        
        return True
    except Exception as e:
        print(f"Database connection error: {str(e)}")
        return False 