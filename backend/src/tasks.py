from celery import Celery
from google.cloud import storage
from model_utils import ContentModerator
import logging
import json
from datetime import datetime
from pathlib import Path
import os
from typing import Dict, Any, List
import redis

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Redis
redis_client = redis.Redis(host='localhost', port=6379, db=0)

# Initialize Celery
celery_app = Celery('tasks', broker='redis://localhost:6379/0')

# Initialize Google Cloud Storage
storage_client = storage.Client()
bucket_name = os.getenv('GOOGLE_CLOUD_BUCKET', 'fsociety-ai-models')
bucket = storage_client.bucket(bucket_name)

# Initialize content moderator
moderator = ContentModerator()

@celery_app.task
def analyze_text_batch(texts: List[str], batch_id: str) -> Dict[str, Any]:
    """Analyze a batch of texts asynchronously"""
    try:
        results = []
        for text in texts:
            analysis = moderator.get_detailed_analysis(text)
            results.append(analysis)

        # Store results in Redis with 1-hour expiration
        redis_client.setex(
            f"batch_results:{batch_id}",
            3600,  # 1 hour
            json.dumps(results)
        )

        return {
            "status": "success",
            "batch_id": batch_id,
            "count": len(results)
        }
    except Exception as e:
        logger.error(f"Error in batch analysis: {str(e)}")
        return {
            "status": "error",
            "batch_id": batch_id,
            "error": str(e)
        }

@celery_app.task
def train_model_async(
    file_path: str,
    config: Dict[str, Any],
    training_id: str
) -> Dict[str, Any]:
    """Train model asynchronously"""
    try:
        from train import ModelTrainer
        
        # Initialize trainer
        trainer = ModelTrainer(**config)
        
        # Prepare data
        train_loader, val_loader = trainer.prepare_data(
            file_path,
            'text',
            'label'
        )
        
        # Train model
        history = trainer.train(train_loader, val_loader)
        
        # Evaluate model
        metrics = trainer.evaluate_model(val_loader)
        
        # Save results locally
        results_dir = Path("training_results") / training_id
        results_dir.mkdir(parents=True, exist_ok=True)
        
        with open(results_dir / "history.json", "w") as f:
            json.dump(history, f)
        with open(results_dir / "metrics.json", "w") as f:
            json.dump(metrics, f)
        
        # Upload results to Google Cloud Storage
        blob = bucket.blob(f"training_results/{training_id}/model.pt")
        blob.upload_from_filename(str(Path("weights") / "toxic_classifier.pt"))
        
        blob = bucket.blob(f"training_results/{training_id}/metrics.json")
        blob.upload_from_filename(str(results_dir / "metrics.json"))
        
        # Store status in Redis
        redis_client.setex(
            f"training_status:{training_id}",
            86400,  # 24 hours
            json.dumps({
                "status": "completed",
                "timestamp": datetime.now().isoformat(),
                "metrics": metrics
            })
        )
        
        # Cleanup
        Path(file_path).unlink()
        
        return {
            "status": "success",
            "training_id": training_id,
            "metrics": metrics
        }
    except Exception as e:
        logger.error(f"Training error: {str(e)}")
        redis_client.setex(
            f"training_status:{training_id}",
            86400,  # 24 hours
            json.dumps({
                "status": "failed",
                "timestamp": datetime.now().isoformat(),
                "error": str(e)
            })
        )
        return {
            "status": "error",
            "training_id": training_id,
            "error": str(e)
        }

@celery_app.task
def sync_model_weights():
    """Sync model weights with Google Cloud Storage"""
    try:
        # Download latest weights
        blob = bucket.blob("models/latest/toxic_classifier.pt")
        weights_path = Path("weights") / "toxic_classifier.pt"
        blob.download_to_filename(str(weights_path))
        
        # Reload model with new weights
        moderator._load_custom_weights()
        
        return {
            "status": "success",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error syncing weights: {str(e)}")
        return {
            "status": "error",
            "error": str(e)
        } 