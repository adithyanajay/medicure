from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import logging
import traceback
import openai
from dotenv import load_dotenv
import os
import json

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
OPENROUTER_API_KEY = os.getenv('OPENROUTER_API_KEY')

# Get the absolute path to the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))
responses_path = os.path.join(current_dir, 'responses.json')

# Load responses from JSON file
with open(responses_path) as f:
    responses = json.load(f)

# Import your ML logic and mental health router
from ml_model.predictor import hybrid_predict, get_symptom_suggestions
from routes.mental_health import router as mental_health_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the expected request body
class SymptomsRequest(BaseModel):
    symptoms: List[str]
    denied_symptoms: Optional[List[str]] = []

# Initialize FastAPI app
app = FastAPI(
    title="MediCure API",
    version="1.0.0",
    description="API for MediCure - An AI-powered Medical Assistant"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include the mental health router
app.include_router(mental_health_router, prefix="/mental-health", tags=["Mental Health"])

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to MediCure API. Use /predict endpoint to get a diagnosis."}

# Predict endpoint
@app.post("/predict")
async def predict(request: SymptomsRequest):
    try:
        logger.info(f"Received Symptoms: {request.symptoms}")
        logger.info(f"Denied Symptoms: {request.denied_symptoms}")
        
        if not all(isinstance(s, str) for s in request.symptoms):
            logger.error("Invalid symptom type detected")
            raise HTTPException(status_code=400, detail="All symptoms must be strings")
        
        prediction_result = hybrid_predict(
            symptoms=request.symptoms,
            denied_symptoms=request.denied_symptoms
        )
        
        suggested_symptoms = get_symptom_suggestions(
            current_symptoms=request.symptoms,
            denied_symptoms=request.denied_symptoms,
            predicted_disease=prediction_result["Most Probable Disease"],
            alternative_diseases=prediction_result["Possible Alternatives"],
            confidence_threshold=prediction_result["Confidence"]
        )
        
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

# Run the server
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True,
        workers=1
    )
