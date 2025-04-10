from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any, Union
import uvicorn
import logging
import traceback

from ml_model.predictor import hybrid_predict, get_symptom_suggestions
from routes.mental_health import router as mental_health_router
from routes.emergency import router as emergency_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define request models
class SymptomsRequest(BaseModel):
    symptoms: List[str]
    denied_symptoms: Optional[List[str]] = []

class NextSymptomRequest(BaseModel):
    current_symptoms: List[str]
    denied_symptoms: Optional[List[str]] = []
    predicted_disease: Optional[str] = None
    alternative_diseases: Optional[List[str]] = []
    confidence_threshold: Optional[float] = 0.5

# Initialize FastAPI
app = FastAPI(
    title="MediCure API",
    version="1.0.0",
    description="API for MediCure - An AI-powered Medical Assistant"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Include routers
app.include_router(mental_health_router, prefix="/mental-health", tags=["Mental Health"])
app.include_router(emergency_router, prefix="/emergency", tags=["Emergency Services"])

@app.get("/")
async def root():
    return {"message": "Welcome to MediCure API. Use /predict endpoint to get a diagnosis."}

@app.post("/predict")
async def predict(request: SymptomsRequest):
    """
    Make a prediction based on symptoms
    """
    try:
        # Log received symptoms
        logger.info(f"Received Symptoms: {request.symptoms}")
        logger.info(f"Denied Symptoms: {request.denied_symptoms}")
        
        # Type checking
        if not all(isinstance(s, str) for s in request.symptoms):
            logger.error("Invalid symptom type detected")
            raise HTTPException(status_code=400, detail="All symptoms must be strings")
            
        # Log symptom types for debugging
        logger.info(f"Symptoms types: {[type(s) for s in request.symptoms]}")
        
        # Get prediction
        prediction_result = hybrid_predict(
            symptoms=request.symptoms,
            denied_symptoms=request.denied_symptoms
        )
        
        # Get suggested next symptoms based on prediction
        suggested_symptoms = get_symptom_suggestions(
            current_symptoms=request.symptoms,
            denied_symptoms=request.denied_symptoms,
            predicted_disease=prediction_result["Most Probable Disease"],
            alternative_diseases=prediction_result["Possible Alternatives"],
            confidence_threshold=prediction_result["Confidence"]
        )
        
        # Return structured response
        response = {
            "prediction": prediction_result,
            "suggested_symptoms": suggested_symptoms
        }
        
        logger.info(f"Prediction Response: {response}")
        return response
        
    except Exception as e:
        logger.error(f"Error in prediction: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/next-symptoms")
async def next_symptoms(request: NextSymptomRequest):
    """
    Get suggested next symptoms based on current diagnosis state
    """
    try:
        # If no current symptoms, suggest starting symptoms
        if not request.current_symptoms:
            return {
                "suggested_symptoms": ["fever", "cough", "headache"]
            }
        
        # Get current prediction for symptom guidance
        prediction_result = hybrid_predict(
            symptoms=request.current_symptoms,
            denied_symptoms=request.denied_symptoms
        )
        
        # Get suggested next symptoms
        suggested_symptoms = get_symptom_suggestions(
            current_symptoms=request.current_symptoms,
            denied_symptoms=request.denied_symptoms,
            predicted_disease=prediction_result["Most Probable Disease"],
            alternative_diseases=prediction_result["Possible Alternatives"],
            confidence_threshold=prediction_result.get("Confidence", 0.5)
        )
        
        # Prepare response
        response = {
            "prediction": prediction_result,
            "suggested_symptoms": suggested_symptoms
        }
        
        return response
        
    except Exception as e:
        logger.error(f"Error getting next symptoms: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error suggesting symptoms: {str(e)}")

# Startup event to check ML models
@app.on_event("startup")
async def startup_event():
    logger.info("MediCure API started")
    logger.info("Checking ML models...")
    try:
        # Test the ML models with a simple prediction
        test_result = hybrid_predict(["fever"])
        logger.info(f"Test prediction successful: {test_result}")
    except Exception as e:
        logger.error(f"Error testing ML models: {str(e)}")
        logger.error(traceback.format_exc())

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",  # Allow external connections
        port=8000,
        reload=True,     # Enable auto-reload for development
        log_level="info",
        access_log=True,
        workers=1        # Single worker for development
    )


# This for testing