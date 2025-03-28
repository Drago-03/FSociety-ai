from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    api_key = Column(String, unique=True, index=True)
    
    analysis_requests = relationship("AnalysisRequest", back_populates="user")
    model_trainings = relationship("ModelTraining", back_populates="user")

class AnalysisRequest(Base):
    __tablename__ = "analysis_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    text = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime)
    status = Column(String)  # pending, completed, failed
    result_id = Column(String)  # Reference to MongoDB document
    
    user = relationship("User", back_populates="analysis_requests")

class ModelTraining(Base):
    __tablename__ = "model_trainings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    model_name = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    status = Column(String)  # pending, training, completed, failed
    parameters = Column(JSON)
    metrics = Column(JSON)
    result_id = Column(String)  # Reference to MongoDB document
    
    user = relationship("User", back_populates="model_trainings")

class ModelVersion(Base):
    __tablename__ = "model_versions"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=False)
    training_id = Column(Integer, ForeignKey("model_trainings.id"))
    metrics = Column(JSON)
    parameters = Column(JSON)
    
    # Cloud storage paths
    weights_path = Column(String)
    config_path = Column(String) 