from google.cloud import storage
from google.cloud.storage import Blob
from pathlib import Path
import os
import json
from datetime import datetime
from typing import Optional, Dict, Any, List
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CloudStorage:
    def __init__(self):
        """Initialize Google Cloud Storage client."""
        self.client = storage.Client()
        self.bucket_name = os.getenv("GCP_BUCKET_NAME", "content-moderation-models")
        self.bucket = self.client.bucket(self.bucket_name)
        
        # Ensure bucket exists
        if not self.bucket.exists():
            self.bucket = self.client.create_bucket(self.bucket_name)
            logger.info(f"Created new bucket: {self.bucket_name}")
    
    def upload_model(self, model_path: str, version: str) -> Dict[str, str]:
        """
        Upload model files to Google Cloud Storage.
        
        Args:
            model_path: Local path to model directory
            version: Model version string
        
        Returns:
            Dictionary with cloud storage paths
        """
        try:
            model_dir = Path(model_path)
            cloud_paths = {}
            
            # Upload model files
            for file_path in model_dir.glob("**/*"):
                if file_path.is_file():
                    relative_path = file_path.relative_to(model_dir)
                    blob_path = f"models/{version}/{relative_path}"
                    blob = self.bucket.blob(blob_path)
                    
                    blob.upload_from_filename(str(file_path))
                    cloud_paths[relative_path.name] = blob_path
                    
                    logger.info(f"Uploaded {file_path} to {blob_path}")
            
            return cloud_paths
            
        except Exception as e:
            logger.error(f"Error uploading model: {str(e)}")
            raise
    
    def download_model(self, version: str, target_dir: str) -> bool:
        """
        Download model files from Google Cloud Storage.
        
        Args:
            version: Model version to download
            target_dir: Local directory to save files
        
        Returns:
            True if successful, False otherwise
        """
        try:
            target_path = Path(target_dir)
            target_path.mkdir(parents=True, exist_ok=True)
            
            # List all blobs in model version directory
            blobs = self.bucket.list_blobs(prefix=f"models/{version}/")
            
            for blob in blobs:
                relative_path = blob.name.replace(f"models/{version}/", "")
                if relative_path:  # Skip directory marker
                    file_path = target_path / relative_path
                    file_path.parent.mkdir(parents=True, exist_ok=True)
                    
                    blob.download_to_filename(str(file_path))
                    logger.info(f"Downloaded {blob.name} to {file_path}")
            
            return True
            
        except Exception as e:
            logger.error(f"Error downloading model: {str(e)}")
            return False
    
    def upload_training_data(self, data_path: str, metadata: Dict[str, Any]) -> str:
        """
        Upload training data with metadata.
        
        Args:
            data_path: Path to training data file
            metadata: Dictionary of metadata about the dataset
        
        Returns:
            Cloud storage path of uploaded data
        """
        try:
            timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            blob_path = f"training_data/{timestamp}.csv"
            
            # Upload data file
            blob = self.bucket.blob(blob_path)
            blob.upload_from_filename(data_path)
            
            # Upload metadata
            metadata_path = f"training_data/{timestamp}_metadata.json"
            metadata_blob = self.bucket.blob(metadata_path)
            metadata_blob.upload_from_string(json.dumps(metadata))
            
            logger.info(f"Uploaded training data to {blob_path}")
            return blob_path
            
        except Exception as e:
            logger.error(f"Error uploading training data: {str(e)}")
            raise
    
    def list_model_versions(self) -> List[str]:
        """
        List available model versions.
        
        Returns:
            List of version strings
        """
        try:
            versions = set()
            blobs = self.bucket.list_blobs(prefix="models/")
            
            for blob in blobs:
                parts = blob.name.split("/")
                if len(parts) > 2:  # models/version/file
                    versions.add(parts[1])
            
            return sorted(list(versions))
            
        except Exception as e:
            logger.error(f"Error listing model versions: {str(e)}")
            return []
    
    def delete_model_version(self, version: str) -> bool:
        """
        Delete a model version and all associated files.
        
        Args:
            version: Version string to delete
        
        Returns:
            True if successful, False otherwise
        """
        try:
            blobs = self.bucket.list_blobs(prefix=f"models/{version}/")
            for blob in blobs:
                blob.delete()
                logger.info(f"Deleted {blob.name}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting model version: {str(e)}")
            return False 