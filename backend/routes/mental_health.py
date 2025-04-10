from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Optional
import logging
from fastapi.responses import JSONResponse
import requests
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from collections import defaultdict

router = APIRouter()

# Configure logging with more detail
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
openrouter_api_key = os.getenv("OPENROUTER_API_KEY")

# Validate API keys
if not openrouter_api_key:
    logger.error("OpenRouter API key not found in environment variables")
    raise ValueError("OpenRouter API key not configured")
else:
    logger.info(f"OpenRouter API key loaded successfully: {openrouter_api_key[:8]}...")

# Rate limiting configuration
RATE_LIMIT_DURATION = timedelta(minutes=1)  # 1 minute window
MAX_REQUESTS_PER_WINDOW = 10  # 10 requests per minute
rate_limit_store = defaultdict(list)  # Store request timestamps per user

# Initialize OpenRouter API configuration
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
OPENROUTER_HEADERS = {
    "Authorization": f"Bearer {openrouter_api_key}",
    "HTTP-Referer": "https://medicure.com",
    "X-Title": "MediCure Mental Health Support"
}

# Test the API connection
try:
    test_response = requests.post(
        OPENROUTER_API_URL,
        headers=OPENROUTER_HEADERS,
        json={
            "model": "openai/gpt-3.5-turbo",
            "messages": [{"role": "system", "content": "Test message"}],
            "max_tokens": 5
        }
    )
    test_response.raise_for_status()
    logger.info("OpenRouter API test successful")
    model_loaded = True
except Exception as e:
    logger.error(f"Error initializing OpenRouter client: {str(e)}")
    model_loaded = False

# Emergency resources with color coding
EMERGENCY_RESOURCES = [
    {"text": "🚨 24/7 Crisis Support: Call 988", "color": "red"},
    {"text": "🚨 Text HOME to 741741 for Crisis Support", "color": "red"},
    {"text": "🚨 Campus Counseling Center (24/7): [Your Campus Number]", "color": "red"}
]

# Campus resources
CAMPUS_RESOURCES = [
    {"text": "Campus Counseling Services - Free for Students", "color": "default"},
    {"text": "Student Wellness Center - Drop-in Hours Available", "color": "default"},
    {"text": "24/7 Student Support Line - Always Here to Listen", "color": "default"}
]

# Conversation memory (in-memory for demo, should use database in production)
conversation_memory = {}

# Crisis keywords that trigger rule-based responses
CRISIS_KEYWORDS = [
    "suicide", "kill myself", "end my life", "want to die", "better off dead",
    "don't want to live", "take my life", "end it all", "no point in living",
    "self-harm", "hurt myself", "cut myself", "harm myself",
    "can't take it anymore", "everyone would be better off", "no reason to live",
    "want to disappear", "make the pain stop", "no way out",
    "going to kill", "plan to end", "saying goodbye", "final message"
]

# Help-seeking keywords
HELP_KEYWORDS = [
    "need help", "need to talk", "help me", "can't cope",
    "need support", "someone to talk to", "need advice",
    "feeling lost", "don't know what to do"
]

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    suggestions: Optional[List[str]] = None
    resources: Optional[List[Dict[str, str]]] = None
    is_emergency: bool = False
    immediate_actions: Optional[List[str]] = None

def get_conversation_history(user_id: str) -> List[Dict[str, str]]:
    """Get conversation history for a user."""
    if user_id not in conversation_memory:
        conversation_memory[user_id] = []
    return conversation_memory[user_id][-5:]  # Keep last 5 messages for context

def update_conversation_history(user_id: str, role: str, content: str):
    """Update conversation history for a user."""
    if user_id not in conversation_memory:
        conversation_memory[user_id] = []
    conversation_memory[user_id].append({"role": role, "content": content})
    # Keep only last 5 messages
    conversation_memory[user_id] = conversation_memory[user_id][-5:]

def detect_crisis(message: str) -> bool:
    """Check if the message indicates a crisis situation."""
    return any(keyword in message.lower() for keyword in CRISIS_KEYWORDS)

def detect_help_seeking(message: str) -> bool:
    """Check if the message indicates someone seeking help."""
    return any(keyword in message.lower() for keyword in HELP_KEYWORDS)

def check_rate_limit(user_id: str) -> bool:
    """Check if user has exceeded rate limit."""
    current_time = datetime.now()
    user_requests = rate_limit_store[user_id]
    
    # Remove old requests outside the window
    user_requests = [time for time in user_requests 
                    if current_time - time < RATE_LIMIT_DURATION]
    rate_limit_store[user_id] = user_requests
    
    # Check if user has exceeded limit
    return len(user_requests) < MAX_REQUESTS_PER_WINDOW

def generate_ai_response(message: str, conversation_history: List[Dict[str, str]]) -> str:
    """Generate a response using OpenRouter API."""
    try:
        if not model_loaded:
            raise Exception("OpenRouter model not initialized")
        
        # Prepare messages for the API
        messages = [
            {
                "role": "system", 
                "content": (
                    "You are an empathetic mental health support assistant. "
                    "Respond with care, understanding, and professionalism. "
                    "Focus on active listening and providing supportive responses. "
                    "Never diagnose or provide medical advice. "
                    "If someone expresses thoughts of self-harm or suicide, "
                    "direct them to professional help immediately. "
                    "Keep responses concise but supportive, around 2-3 sentences."
                )
            }
        ]
        messages.extend(conversation_history)
        messages.append({"role": "user", "content": message})
        
        # Make request to OpenRouter API
        response = requests.post(
            OPENROUTER_API_URL,
            headers=OPENROUTER_HEADERS,
            json={
                "model": "openai/gpt-3.5-turbo",
                "messages": messages,
                "max_tokens": 150,
                "temperature": 0.7,
                "top_p": 0.9,
                "frequency_penalty": 0.5,
                "presence_penalty": 0.5
            }
        )
        response.raise_for_status()
        
        return response.json()["choices"][0]["message"]["content"].strip()
        
    except Exception as e:
        logger.error(f"Error with OpenRouter: {str(e)}")
        
        # Fallback responses based on message content
        message_lower = message.lower()
        
        # Check for common themes and provide appropriate responses
        if any(word in message_lower for word in ['tired', 'exhausted', 'fatigue', 'no energy']):
            return ("I hear that you're feeling tired. That can be really challenging. Would you like to explore some "
                   "gentle self-care strategies or talk about what's contributing to your fatigue?")
        
        elif any(word in message_lower for word in ['stress', 'overwhelm', 'pressure', 'too much']):
            return ("It sounds like you're dealing with a lot of stress. Let's break this down into smaller, "
                   "more manageable pieces. What's feeling most overwhelming right now?")
        
        elif any(word in message_lower for word in ['sad', 'depressed', 'down', 'blue']):
            return ("I'm sorry you're feeling down. Your feelings are valid, and you're not alone in this. "
                   "Would you like to talk more about what's troubling you?")
        
        elif any(word in message_lower for word in ['angry', 'mad', 'frustrated']):
            return ("It's natural to feel frustrated sometimes. Would you like to talk about what's causing "
                   "these feelings? We can explore healthy ways to express and manage them.")
        
        elif any(word in message_lower for word in ['anxious', 'worried', 'nervous', 'fear']):
            return ("Anxiety can be really challenging to deal with. Let's focus on what you're feeling right now. "
                   "Would you like to try some grounding exercises together?")
        
        elif any(word in message_lower for word in ['help', 'support', 'need', 'please']):
            return ("I'm here to support you. You've taken an important step by reaching out. "
                   "Would you like to tell me more about what kind of help you're looking for?")
        
        else:
            return ("I'm here to listen and support you. Would you like to tell me more about what's on your mind? "
                   "Sometimes talking things through can help provide clarity.")

def generate_response(message: str, user_id: str) -> Dict:
    """Generate a hybrid response using both rule-based and AI approaches."""
    
    # Check for crisis situations first (rule-based)
    if detect_crisis(message):
        response = {
            "message": (
                "I hear how much pain you're in, and I'm very concerned about your safety. "
                "Your life has value, and there are people who want to help you right now. "
                "You don't have to go through this alone."
            ),
            "suggestions": [
                "Can I help you call the crisis hotline? They're trained to help and available 24/7",
                "Would you be willing to speak with a counselor right now?",
                "Can we talk about what's making you feel this way?",
                "Would you like me to help you reach out to someone you trust?"
            ],
            "resources": EMERGENCY_RESOURCES,
            "immediate_actions": [
                "If you're in immediate danger, please call 988 or go to the nearest emergency room",
                "You can reach the campus counseling center 24/7 for immediate support",
                "Stay on the line with me - I want to make sure you get the help you need",
                "Let's work together to keep you safe right now"
            ],
            "is_emergency": True
        }
        update_conversation_history(user_id, "assistant", response["message"])
        return response
    
    # Check for help-seeking behavior (rule-based)
    if detect_help_seeking(message):
        response = {
            "message": (
                "I'm glad you reached out. It takes courage to ask for help, and I'm here to support you. "
                "Would you like to talk about what's been going on?"
            ),
            "suggestions": [
                "Would you like information about our counseling services?",
                "Should we explore some coping strategies together?",
                "Would you like to tell me more about what you're experiencing?",
                "Would it help to talk about what's been challenging lately?"
            ],
            "resources": CAMPUS_RESOURCES,
            "is_emergency": False
        }
        update_conversation_history(user_id, "assistant", response["message"])
        return response
    
    # For general conversations, use AI or fallback
    update_conversation_history(user_id, "user", message)
    conversation_history = get_conversation_history(user_id)
    ai_response = generate_ai_response(message, conversation_history)
    update_conversation_history(user_id, "assistant", ai_response)
    
    return {
        "message": ai_response,
        "suggestions": [
            "Would you like to tell me more about that?",
            "How are you feeling about this?",
            "What support would be most helpful right now?",
            "Would you like to explore some coping strategies?"
        ],
        "resources": CAMPUS_RESOURCES,
        "is_emergency": False
    }

@router.post("/chat")
async def chat_with_bot(request: ChatRequest):
    """Process a chat message and return a supportive response."""
    try:
        user_id = request.user_id or "anonymous"
        
        # Check rate limit
        if not check_rate_limit(user_id):
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please wait a moment before sending another message."
            )
        
        # Record this request
        rate_limit_store[user_id].append(datetime.now())
        
        # Generate appropriate response using hybrid approach
        response = generate_response(
            request.message,
            user_id
        )
        return JSONResponse(content=response)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your message. Please try again."
        )