import os
from typing import List
from pydantic import BaseSettings

class Settings(BaseSettings):
    # Project settings
    PROJECT_NAME: str = "FSociety AI Content Moderation"
    MODEL_VERSION: str = "1.0.0"
    
    # API settings
    API_KEY_HEADER: str = "X-API-Key"
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173", "*"]
    
    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./fsociety.db")
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "fsociety_ai")
    
    # Cloud storage settings
    GCP_BUCKET_NAME: str = os.getenv("GCP_BUCKET_NAME", "content-moderation-models")
    
    # Logging settings
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    class Config:
        env_file = ".env"

settings = Settings()