from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.security import HTTPBearer
from typing import Dict, Any, Optional
import logging
from datetime import datetime
import json

from config import settings
from database import get_db, get_mongo_collection
from auth import get_current_user, get_optional_user

# Configure logging
logging.basicConfig(level=settings.LOG_LEVEL, format=settings.LOG_FORMAT)
logger = logging.getLogger(__name__)

# Initialize router
router = APIRouter(prefix="/integrations", tags=["integrations"])

# Security
security = HTTPBearer()

# Platform handlers
platform_handlers = {
    "facebook": None,  # Will be initialized on demand
    "twitter": None,
    "wordpress": None,
    "discord": None,
    "slack": None
}

@router.post("/connect")
async def connect_platform(
    data: Dict[str, Any],
    background_tasks: BackgroundTasks = None,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """Connect to a platform using provided credentials"""
    platform_id = data.get("platformId")
    credentials = data.get("credentials")
    
    if not platform_id or not credentials:
        raise HTTPException(status_code=400, detail="Platform ID and credentials are required")
    
    if platform_id not in platform_handlers:
        raise HTTPException(status_code=400, detail=f"Unsupported platform: {platform_id}")
    
    try:
        # In a real implementation, this would validate credentials with the platform
        # and establish a connection
        
        # For demo purposes, we'll simulate a successful connection
        connection_status = {
            "connected": True,
            "lastConnected": datetime.now().isoformat(),
        }
        
        # Store connection in database
        user_id = user["uid"]
        collection = await get_mongo_collection("platform_integrations")
        await collection.update_one(
            {"user_id": user_id, "platform_id": platform_id},
            {"$set": {
                "user_id": user_id,
                "platform_id": platform_id,
                "credentials": credentials,  # In production, these should be encrypted
                "status": connection_status,
                "updated_at": datetime.now().isoformat()
            }},
            upsert=True
        )
        
        # Schedule background task to sync initial content
        if background_tasks:
            background_tasks.add_task(sync_platform_content, user_id, platform_id)
        
        return {"status": connection_status}
    except Exception as e:
        logger.error(f"Error connecting to {platform_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to connect to platform: {str(e)}")

@router.post("/disconnect")
async def disconnect_platform(
    data: Dict[str, Any],
    user: Dict[str, Any] = Depends(get_current_user)
):
    """Disconnect from a platform"""
    platform_id = data.get("platformId")
    
    if not platform_id:
        raise HTTPException(status_code=400, detail="Platform ID is required")
    
    try:
        # Update connection status in database
        user_id = user["uid"]
        collection = await get_mongo_collection("platform_integrations")
        result = await collection.update_one(
            {"user_id": user_id, "platform_id": platform_id},
            {"$set": {
                "status.connected": False,
                "status.lastDisconnected": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat()
            }}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail=f"No connection found for platform: {platform_id}")
        
        return {
            "status": {
                "connected": False,
                "lastDisconnected": datetime.now().isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error disconnecting from {platform_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to disconnect from platform: {str(e)}")

@router.get("/status")
async def get_integration_status(
    user: Dict[str, Any] = Depends(get_current_user)
):
    """Get integration status for all platforms"""
    try:
        user_id = user["uid"]
        collection = await get_mongo_collection("platform_integrations")
        integrations = await collection.find({"user_id": user_id}).to_list(length=100)
        
        status = {}
        for integration in integrations:
            platform_id = integration["platform_id"]
            status[platform_id] = integration["status"]
        
        return {"status": status}
    except Exception as e:
        logger.error(f"Error fetching integration status: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch integration status: {str(e)}")

@router.get("/{platform_id}/content")
async def get_platform_content(
    platform_id: str,
    limit: int = 10,
    offset: int = 0,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """Get content from a connected platform"""
    try:
        # Check if platform is connected
        user_id = user["uid"]
        collection = await get_mongo_collection("platform_integrations")
        integration = await collection.find_one({"user_id": user_id, "platform_id": platform_id})
        
        if not integration or not integration["status"]["connected"]:
            raise HTTPException(status_code=400, detail=f"Platform {platform_id} is not connected")
        
        # In a real implementation, this would fetch content from the platform API
        # For demo purposes, we'll return mock data
        content_collection = await get_mongo_collection("platform_content")
        content = await content_collection.find(
            {"user_id": user_id, "platform_id": platform_id}
        ).sort("created_at", -1).skip(offset).limit(limit).to_list(length=limit)
        
        return {"content": content}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching content from {platform_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch content: {str(e)}")

@router.post("/{platform_id}/moderate")
async def moderate_platform_content(
    platform_id: str,
    data: Dict[str, Any],
    background_tasks: BackgroundTasks = None,
    user: Dict[str, Any] = Depends(get_current_user)
):
    """Perform moderation action on platform content"""
    content_id = data.get("contentId")
    action = data.get("action")
    reason = data.get("reason")
    
    if not content_id or not action:
        raise HTTPException(status_code=400, detail="Content ID and action are required")
    
    valid_actions = ["approve", "reject", "hide", "delete"]
    if action not in valid_actions:
        raise HTTPException(status_code=400, detail=f"Invalid action. Must be one of: {', '.join(valid_actions)}")
    
    try:
        # Check if platform is connected
        user_id = user["uid"]
        collection = await get_mongo_collection("platform_integrations")
        integration = await collection.find_one({"user_id": user_id, "platform_id": platform_id})
        
        if not integration or not integration["status"]["connected"]:
            raise HTTPException(status_code=400, detail=f"Platform {platform_id} is not connected")
        
        # In a real implementation, this would perform the action on the platform API
        # For demo purposes, we'll update our local record
        content_collection = await get_mongo_collection("platform_content")
        result = await content_collection.update_one(
            {"_id": content_id, "user_id": user_id, "platform_id": platform_id},
            {"$set": {
                "moderation": {
                    "action": action,
                    "reason": reason,
                    "timestamp": datetime.now().isoformat(),
                    "moderator": user["email"]
                }
            }}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail=f"Content not found: {content_id}")
        
        # Schedule background task to sync the action to the platform
        if background_tasks:
            background_tasks.add_task(
                sync_moderation_action, 
                user_id, 
                platform_id, 
                content_id, 
                action, 
                reason
            )
        
        return {"result": {"success": True, "action": action}}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error moderating content on {platform_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to moderate content: {str(e)}")

async def sync_platform_content(user_id: str, platform_id: str):
    """Background task to sync content from a platform"""
    try:
        logger.info(f"Syncing content from {platform_id} for user {user_id}")
        # In a real implementation, this would fetch content from the platform API
        # and store it in the database
        
        # For demo purposes, we'll create some mock data
        content_collection = await get_mongo_collection("platform_content")
        
        # Generate mock content based on platform
        mock_content = []
        timestamp = datetime.now().isoformat()
        
        if platform_id == "facebook":
            mock_content = [
                {"id": f"fb_{i}", "type": "post", "text": f"Facebook post {i}", "created_at": timestamp}
                for i in range(1, 6)
            ]
        elif platform_id == "twitter":
            mock_content = [
                {"id": f"tw_{i}", "type": "tweet", "text": f"Tweet {i}", "created_at": timestamp}
                for i in range(1, 6)
            ]
        elif platform_id == "wordpress":
            mock_content = [
                {"id": f"wp_{i}", "type": "comment", "text": f"Blog comment {i}", "created_at": timestamp}
                for i in range(1, 6)
            ]
        
        # Store mock content
        for item in mock_content:
            await content_collection.insert_one({
                "user_id": user_id,
                "platform_id": platform_id,
                "content_id": item["id"],
                "content": item,
                "created_at": timestamp
            })
        
        logger.info(f"Synced {len(mock_content)} items from {platform_id} for user {user_id}")
    except Exception as e:
        logger.error(f"Error syncing content from {platform_id}: {str(e)}")

async def sync_moderation_action(user_id: str, platform_id: str, content_id: str, action: str, reason: str = None):
    """Background task to sync moderation action to a platform"""
    try:
        logger.info(f"Syncing moderation action {action} for content {content_id} on {platform_id}")
        # In a real implementation, this would call the platform API to perform the action
        # For demo purposes, we'll just log it
        logger.info(f"Action {action} applied to content {content_id} on {platform_id}")
    except Exception as e:
        logger.error(f"Error syncing moderation action to {platform_id}: {str(e)}")