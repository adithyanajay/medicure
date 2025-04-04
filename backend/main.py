from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes.users import router as user_router
from routes.protected import router as protected_router
from routes.mental_health import router as mental_health_router
from database import check_db_connection
from ml_model.predictor import hybrid_predict  # ✅ Import refined ML function


from pydantic import BaseModel
from typing import List

class SymptomsRequest(BaseModel):
    symptoms: List[str]



app = FastAPI(
    title="Medical App Backend",
    version="1.0.0",
    description="Authentication system using FastAPI & MongoDB Atlas"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routes
app.include_router(user_router, prefix="/auth", tags=["Authentication"])
app.include_router(protected_router, prefix="/protected", tags=["Protected"])
app.include_router(mental_health_router, prefix="/mental-health", tags=["Mental Health"])

# Root API Route
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the Medical App Backend!"}

# ✅ Updated ML Prediction API with hybrid model
@app.post("/predict", tags=["ML Prediction"])
async def get_prediction(request: SymptomsRequest):
    try:
        if not request.symptoms:
            raise HTTPException(status_code=400, detail="No symptoms provided!")

        # print(f"Received Symptoms: {request.symptoms}")  # ✅ Debugging Step

        
        result = hybrid_predict(request.symptoms)

        # print(f"Prediction Result: {result}")  # ✅ Debugging Step

        return {"prediction": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ Call check_db_connection() when the app starts
@app.on_event("startup")
async def startup_db_check():
    await check_db_connection()

