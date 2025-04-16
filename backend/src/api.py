from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader, HTTPBearer
from typing import List, Dict, Any, Optional
import logging
import json
from datetime import datetime

from config import settings
from database import get_db, get_mongo_collection
from model_utils import ContentModerator
from document_verification import DocumentVerifier, WebScraper
from auth import get_current_user, get_optional_user
from integrations import router as integrations_router

# Configure logging
logging.basicConfig(level=settings.LOG_LEVEL, format=settings.LOG_FORMAT)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="FSociety AI Content Moderation",
    description="Content moderation and document verification API",
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

# Include routers
app.include_router(integrations_router)

# Initialize services
content_moderator = ContentModerator()
document_verifier = DocumentVerifier()
web_scraper = WebScraper()

# API Key security
api_key_header = APIKeyHeader(name=settings.API_KEY_HEADER)
security = HTTPBearer()

@app.on_event("startup")
async def startup_event():
    await web_scraper.initialize()

@app.on_event("shutdown")
async def shutdown_event():
    await web_scraper.close()

@app.get("/")
async def root():
    """Root endpoint returning API status and model information."""
    return {
        "status": "online",
        "model_version": settings.MODEL_VERSION,
        "api_version": "1.0.0"
    }

@app.post("/analyze")
async def analyze_text(text: str, user: Optional[Dict[str, Any]] = Depends(get_optional_user)):
    """Analyze a single text for toxic content."""
    try:
        # Analyze text
        result = content_moderator.analyze_toxicity(text)
        
        return {
            "status": "success",
            "result": result
        }
    except Exception as e:
        logger.error(f"Error analyzing content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze content: {str(e)}")

@app.post("/documents/verify")
async def verify_document(
    document: UploadFile = File(...),
    background_tasks: BackgroundTasks = None,
    user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Verify a document for authenticity and detect potential issues."""
    try:
        # Verify document
        result = await document_verifier.verify_document(document)
        
        # Store result in MongoDB (in background)
        if background_tasks:
            background_tasks.add_task(store_verification_result, result)
        
        return {
            "status": "success",
            "result": result
        }
    except Exception as e:
        logger.error(f"Error verifying document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to verify document: {str(e)}")

@app.post("/scrape")
async def scrape_url(url: str, user: Optional[Dict[str, Any]] = Depends(get_optional_user)):
    """Scrape content from a URL for verification."""
    try:
        # Scrape URL
        result = await web_scraper.scrape_url(url)
        
        return {
            "status": "success",
            "result": result
        }
    except Exception as e:
        logger.error(f"Error scraping URL: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to scrape URL: {str(e)}")

@app.post("/scrape-batch")
async def scrape_multiple_urls(urls: List[str]):
    """Scrape content from multiple URLs in parallel."""
    try:
        # Scrape URLs
        results = await web_scraper.scrape_multiple_urls(urls)
        
        return {
            "status": "success",
            "results": results
        }
    except Exception as e:
        logger.error(f"Error scraping URLs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to scrape URLs: {str(e)}")

@app.post("/verify-information")
async def verify_information(
    text: str,
    sources: Optional[List[str]] = None,
    user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """Verify information against trusted sources."""
    try:
        # Use document verifier to check against trusted sources
        similarity_results = await document_verifier.check_against_trusted_sources(text)
        
        return {
            "status": "success",
            "result": similarity_results
        }
    except Exception as e:
        logger.error(f"Error verifying information: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to verify information: {str(e)}")

async def store_verification_result(result: Dict[str, Any]):
    """Store document verification result in MongoDB."""
    try:
        # Get MongoDB collection
        verification_collection = get_mongo_collection("document_verifications")
        
        # Store result
        verification_collection.insert_one({
            **result,
            "stored_at": datetime.utcnow().isoformat()
        })
        
        logger.info(f"Stored verification result for document {result.get('document_id')}")
    except Exception as e:
        logger.error(f"Error storing verification result: {str(e)}")