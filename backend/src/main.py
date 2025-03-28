from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks, File, UploadFile, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime
import json

from config import settings
from database import get_db, get_mongo_collection
from model_utils import ContentModerator
from cloud_storage import CloudStorage
from models import User, AnalysisRequest, ModelTraining, ModelVersion
from tasks import analyze_text_batch, train_model_async, sync_model_weights

# Configure logging
logging.basicConfig(level=settings.LOG_LEVEL, format=settings.LOG_FORMAT)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Content moderation API using transformer models",
    version=settings.MODEL_VERSION,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
content_moderator = ContentModerator()
cloud_storage = CloudStorage()

# API Key security
api_key_header = APIKeyHeader(name=settings.API_KEY_HEADER)

async def verify_api_key(api_key: str = Depends(api_key_header), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.api_key == api_key).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return user

@app.get("/")
async def root():
    """Root endpoint returning API status and model information."""
    return {
        "status": "online",
        "model_version": settings.MODEL_VERSION,
        "api_version": "1.0.0"
    }

@app.post("/analyze")
async def analyze_text(
    text: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(verify_api_key)
):
    """Analyze a single text for toxic content."""
    try:
        # Create analysis request
        request = AnalysisRequest(
            user_id=user.id,
            text=text,
            status="pending"
        )
        db.add(request)
        db.commit()
        
        # Analyze text
        result = content_moderator.get_detailed_analysis(text)
        
        # Store result in MongoDB
        analysis_collection = get_mongo_collection("analysis_results")
        result_doc = {
            "request_id": request.id,
            "user_id": user.id,
            "text": text,
            "result": result,
            "created_at": datetime.utcnow()
        }
        analysis_collection.insert_one(result_doc)
        
        # Update request status
        request.status = "completed"
        request.processed_at = datetime.utcnow()
        request.result_id = str(result_doc["_id"])
        db.commit()
        
        return {
            "request_id": request.id,
            "status": "success",
            "result": result
        }
        
    except Exception as e:
        logger.error(f"Error analyzing text: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch-analyze")
async def batch_analyze(
    texts: List[str],
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    user: User = Depends(verify_api_key)
):
    """Analyze multiple texts in batch."""
    try:
        # Create batch analysis task
        task_id = f"batch_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}_{user.id}"
        
        # Start background task
        background_tasks.add_task(
            analyze_text_batch,
            texts=texts,
            user_id=user.id,
            task_id=task_id
        )
        
        return {
            "status": "accepted",
            "task_id": task_id,
            "message": f"Processing {len(texts)} texts in background"
        }
        
    except Exception as e:
        logger.error(f"Error starting batch analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/train")
async def train_model(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    params: Dict[str, Any] = None,
    db: Session = Depends(get_db),
    user: User = Depends(verify_api_key)
):
    """Start model training with custom data."""
    try:
        # Validate file
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are supported")
        
        # Create training record
        training = ModelTraining(
            user_id=user.id,
            model_name=f"custom_model_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            status="pending",
            parameters=params or {}
        )
        db.add(training)
        db.commit()
        
        # Upload training data to cloud storage
        data_path = f"training_data/{training.id}.csv"
        cloud_storage.upload_training_data(
            file.file,
            {
                "training_id": training.id,
                "user_id": user.id,
                "parameters": params
            }
        )
        
        # Start background training task
        background_tasks.add_task(
            train_model_async,
            training_id=training.id,
            data_path=data_path,
            params=params
        )
        
        return {
            "status": "accepted",
            "training_id": training.id,
            "message": "Model training started in background"
        }
        
    except Exception as e:
        logger.error(f"Error starting model training: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/model-info")
async def get_model_info(db: Session = Depends(get_db)):
    """Get information about the current model."""
    try:
        # Get current model version
        model_version = db.query(ModelVersion)\
            .filter(ModelVersion.is_active == True)\
            .first()
        
        if not model_version:
            return {
                "version": settings.MODEL_VERSION,
                "status": "default"
            }
        
        # Get training info if available
        training = None
        if model_version.training_id:
            training = db.query(ModelTraining)\
                .filter(ModelTraining.id == model_version.training_id)\
                .first()
        
        return {
            "version": model_version.version,
            "created_at": model_version.created_at,
            "metrics": model_version.metrics,
            "training_info": {
                "id": training.id,
                "created_at": training.created_at,
                "completed_at": training.completed_at,
                "parameters": training.parameters
            } if training else None
        }
        
    except Exception as e:
        logger.error(f"Error getting model info: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sync-model")
async def sync_model(
    background_tasks: BackgroundTasks,
    version: str,
    user: User = Depends(verify_api_key)
):
    """Sync model weights from cloud storage."""
    try:
        # Start background sync task
        background_tasks.add_task(
            sync_model_weights,
            version=version
        )
        
        return {
            "status": "accepted",
            "message": f"Syncing model version {version}"
        }
        
    except Exception as e:
        logger.error(f"Error syncing model: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup."""
    try:
        # Initialize content moderator
        await content_moderator.initialize()
        
        # Check database connections
        from database import check_db_connection
        if not check_db_connection():
            logger.error("Database connection failed")
            raise Exception("Database connection failed")
        
        logger.info("Application started successfully")
        
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}")
        raise e

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    try:
        # Cleanup resources
        await content_moderator.cleanup()
        logger.info("Application shutdown successfully")
        
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}")
        raise e 