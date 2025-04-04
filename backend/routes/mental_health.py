from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import json
import random
from textblob import TextBlob
from typing import List, Dict, Optional

router = APIRouter()

# Load responses from JSON file
with open("responses.json", encoding="utf-8") as f:
    responses = json.load(f)

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    activities: List[str]
    resources: List[str]
    emotion: str

class EmotionalKeywords:
    # ... existing code ...
    grief_keywords = {
        "died": 0.8,
        "passed away": 0.8,
        "lost": 0.7,
        "death": 0.8,
        "miss them": 0.7,
        "missing them": 0.7,
        "gone forever": 0.8,
        "funeral": 0.7,
        "grieving": 0.9,
        "mourning": 0.9,
        "deceased": 0.8,
        "no longer here": 0.7,
        "without them": 0.7,
        "empty inside": 0.7
    }

    study_keywords = {
        "can't study": 0.7,
        "hard to focus": 0.7,
        "difficult to concentrate": 0.7,
        "failing": 0.6,
        "grades dropping": 0.6,
        "behind in class": 0.6,
        "can't keep up": 0.6,
        "overwhelmed with work": 0.7,
        "too much coursework": 0.6,
        "academic pressure": 0.7,
        "study problems": 0.7,
        "exam stress": 0.7,
        "homework": 0.5,
        "assignments": 0.5
    }

emotional_keywords = {
    "anxiety": {
        "worried": 0.8, "anxious": 0.9, "nervous": 0.7, "panic": 0.9,
        "scared": 0.7, "fear": 0.8, "overwhelmed": 0.6
    },
    "depression": {
        "sad": 0.7, "depressed": 0.9, "hopeless": 0.8, "worthless": 0.8,
        "empty": 0.7, "tired": 0.6, "exhausted": 0.6
    },
    "grief": {
        "died": 0.8, "passed away": 0.8, "lost": 0.7, "death": 0.8,
        "miss them": 0.7, "missing them": 0.7, "gone forever": 0.8,
        "funeral": 0.7, "grieving": 0.9, "mourning": 0.9, "deceased": 0.8,
        "no longer here": 0.7, "without them": 0.7, "empty inside": 0.7
    },
    "study_difficulties": {
        "can't study": 0.7, "hard to focus": 0.7, "difficult to concentrate": 0.7,
        "failing": 0.8, "grades dropping": 0.6, "behind in class": 0.6,
        "can't keep up": 0.6, "overwhelmed with work": 0.7, "too much coursework": 0.6,
        "academic pressure": 0.7, "study problems": 0.7, "exam stress": 0.7,
        "homework": 0.5, "assignments": 0.5, "failed": 0.8, "fail": 0.8
    }
}

def detect_emotions(message: str) -> Dict[str, float]:
    """
    Detect multiple emotions in a message using both keyword matching and sentiment analysis.
    Returns a dictionary of emotions and their confidence scores.
    """
    # Initialize emotion scores
    emotion_scores = {emotion: 0.0 for emotion in emotional_keywords.keys()}
    
    # Convert message to lowercase for case-insensitive matching
    message_lower = message.lower()
    
    # Check for self-harm or crisis keywords first
    crisis_indicators = [
        "suicide", "kill myself", "end my life", "self-harm", "hurt myself",
        "want to die", "better off dead", "cut myself", "harm myself",
        "going to die", "don't want to live", "take my life", "end it all"
    ]
    
    for indicator in crisis_indicators:
        if indicator in message_lower:
            emotion_scores["crisis"] = 1.0
            return emotion_scores
    
    # Keyword-based emotion detection
    for emotion, keywords in emotional_keywords.items():
        for keyword, weight in keywords.items():
            if keyword in message_lower:
                emotion_scores[emotion] += weight
    
    # If both grief and study issues are detected with significant scores
    grief_score = emotion_scores.get("grief", 0)
    study_score = emotion_scores.get("study_difficulties", 0)
    
    if grief_score > 0.6 and study_score > 0.6:
        emotion_scores["study_grief"] = max(grief_score, study_score)
        # Remove individual scores to use combined response
        emotion_scores.pop("grief", None)
        emotion_scores.pop("study_difficulties", None)
    
    # Sentiment analysis using TextBlob
    blob = TextBlob(message)
    sentiment = blob.sentiment.polarity
    
    # Adjust scores based on sentiment
    if sentiment < -0.3:  # Negative sentiment
        emotion_scores["depression"] = emotion_scores.get("depression", 0) + 0.3
        emotion_scores["anxiety"] = emotion_scores.get("anxiety", 0) + 0.2
    elif sentiment > 0.3:  # Positive sentiment
        for emotion in emotion_scores:
            emotion_scores[emotion] *= 0.5  # Reduce negative emotion scores
    
    # Normalize scores
    max_score = max(emotion_scores.values())
    if max_score > 0:
        emotion_scores = {k: v/max_score for k, v in emotion_scores.items()}
    
    return emotion_scores

def get_contextual_response(emotion_scores: Dict[str, float], message: str) -> Dict:
    """
    Generate a contextual response based on detected emotions and message content.
    """
    # Check for crisis keywords first
    if emotion_scores.get("crisis", 0) > 0.5:
        return {
            "emotion": "crisis",
            "message": responses["crisis"]["message"],
            "activities": responses["crisis"]["activities"],
            "resources": responses["crisis"]["resources"],
            "is_emergency": True
        }
    
    # Check for study_grief first
    if emotion_scores.get("study_grief", 0) > 0.6:
        return {
            "emotion": "study_grief",
            "message": responses["study_grief"]["message"],
            "activities": responses["study_grief"]["activities"],
            "resources": responses["study_grief"]["resources"],
            "is_emergency": False
        }
    
    # Get top emotions (scores > 0.3)
    top_emotions = [emotion for emotion, score in emotion_scores.items() 
                   if score > 0.3]
    
    if not top_emotions:
        # If no strong emotions detected, provide a supportive general response
        general_response = responses["general"]
        return {
            "emotion": "general",
            "message": general_response["message"],
            "activities": general_response["activities"],
            "resources": general_response["resources"],
            "is_emergency": False
        }
    
    # Get the highest scoring emotion
    primary_emotion = max(emotion_scores.items(), key=lambda x: x[1])[0]
    
    # Get response for the primary emotion
    response = responses.get(primary_emotion)
    if isinstance(response, list):
        response = response[0]  # Handle list-style responses
    elif not response:
        response = responses["general"]
    
    # Add a supportive prefix for emotional responses
    supportive_prefix = "I hear you and I'm here to support you. "
    if "message" in response:
        response["message"] = supportive_prefix + response["message"]
    
    return {
        "emotion": primary_emotion,
        "message": response["message"],
        "activities": response["activities"],
        "resources": response["resources"],
        "is_emergency": False
    }

@router.post("/chat")
async def chat_with_bot(request: ChatRequest):
    """
    Process a chat message and return an appropriate response.
    """
    # Detect emotions in the message
    emotion_scores = detect_emotions(request.message)
    
    # Get contextual response
    response = get_contextual_response(emotion_scores, request.message)
    
    return response 