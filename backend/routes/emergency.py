from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from typing import Dict, Optional
import os
import logging
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()

# Load API Keys from environment variables
GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

# Check if keys are valid (not placeholder values)
if GOOGLE_MAPS_API_KEY and GOOGLE_MAPS_API_KEY != "YOUR_GOOGLE_MAPS_API_KEY":
    import googlemaps
    gmaps = googlemaps.Client(key=GOOGLE_MAPS_API_KEY)
else:
    gmaps = None
    logger.warning("Google Maps API key not set or is a placeholder. Geocoding features will be disabled.")

# Check if Twilio credentials are valid
if TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER and \
   TWILIO_ACCOUNT_SID != "YOUR_TWILIO_ACCOUNT_SID" and \
   TWILIO_AUTH_TOKEN != "YOUR_TWILIO_AUTH_TOKEN" and \
   TWILIO_PHONE_NUMBER != "YOUR_TWILIO_PHONE_NUMBER":
    from twilio.rest import Client
    twilio_client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
else:
    twilio_client = None
    logger.warning("Twilio credentials not set or are placeholders. SMS features will be disabled.")

# Emergency contact numbers by district
# This should be replaced with a database in production
EMERGENCY_CONTACTS = {
    "New York": ["8330085070"],
    "Los Angeles": ["8330085070"],
    "Chicago": ["8330085070"],
    "Default": ["8330085070"]  # Default emergency number
}

class EmergencyRequest(BaseModel):
    latitude: float
    longitude: float
    timestamp: str
    user_id: Optional[str] = None
    emergency_type: Optional[str] = "Medical Emergency"
    additional_info: Optional[str] = None

@router.post("/send-alert")
async def send_emergency_alert(request: EmergencyRequest):
    """
    Send emergency alert with the user's location to the appropriate emergency service
    """
    try:
        logger.info(f"Emergency request received: {request}")
        
        # Create Google Maps link (this works even without API key)
        maps_link = f"https://www.google.com/maps/search/?api=1&query={request.latitude},{request.longitude}"
        
        # Check for mock/demo mode
        if not gmaps or not twilio_client:
            logger.warning("Running in demo mode without full API configuration")
            district = "Demo District"
            return {
                "success": True, 
                "message": "Demo mode: Emergency alert simulated",
                "district": district,
                "location_link": maps_link,
                "demo_mode": True
            }
            
        # Reverse geocode to get the address and district
        district = await get_district(request.latitude, request.longitude)
        
        # Get emergency contacts for the district
        contacts = EMERGENCY_CONTACTS.get(district, EMERGENCY_CONTACTS["Default"])
        
        # Create emergency message with complete information
        emergency_message = f"""
{request.emergency_type}

LOCATION: {maps_link}

{request.additional_info if request.additional_info else "No additional information provided."}

Sent via MediCure Emergency System
"""
        
        # Send SMS to emergency contacts
        sms_results = []
        for contact in contacts:
            success = await send_emergency_sms(contact, emergency_message)
            sms_results.append({"contact": contact, "success": success})
            logger.info(f"SMS sent to {contact}: {success}")
        
        return {
            "success": True, 
            "message": "Emergency alert sent successfully",
            "district": district,
            "location_link": maps_link,
            "contacts_notified": len(contacts),
            "sms_results": sms_results
        }
        
    except Exception as e:
        logger.error(f"Error sending emergency alert: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error sending emergency alert: {str(e)}")

async def get_district(latitude: float, longitude: float) -> str:
    """
    Get the district name from coordinates using Google Maps Geocoding API
    """
    if not gmaps:
        return "Default"
        
    try:
        # Reverse geocode the coordinates
        reverse_geocode_result = gmaps.reverse_geocode((latitude, longitude))
        
        if not reverse_geocode_result:
            return "Default"
        
        # Extract administrative area (district/city)
        district = "Default"
        for result in reverse_geocode_result:
            address_components = result.get('address_components', [])
            for component in address_components:
                # Look for locality (city) or administrative_area_level_2 (county/district)
                types = component.get('types', [])
                if 'locality' in types or 'administrative_area_level_2' in types:
                    district = component.get('long_name', 'Default')
                    return district
        
        return district
    
    except Exception as e:
        logger.error(f"Error getting district: {str(e)}")
        return "Default"

async def send_emergency_sms(to_number: str, message: str) -> bool:
    """
    Send emergency SMS using Twilio
    """
    if not twilio_client:
        logger.warning(f"SMS not sent to {to_number} (demo mode)")
        return False
        
    try:
        # Send SMS via Twilio
        message = twilio_client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=to_number
        )
        
        logger.info(f"SMS sent: {message.sid}")
        return True
        
    except Exception as e:
        logger.error(f"Error sending SMS: {str(e)}")
        return False

@router.get("/test")
async def test_emergency_service():
    """
    Test endpoint for the emergency service
    """
    services_status = {
        "google_maps": gmaps is not None,
        "twilio": twilio_client is not None,
        "demo_mode": (gmaps is None or twilio_client is None)
    }
    
    return {
        "status": "Emergency service is running",
        "services": services_status
    } 