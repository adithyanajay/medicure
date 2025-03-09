from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.users import router as user_router
from routes.protected import router as protected_router
import asyncio
from database import check_db_connection  # ✅ Import check_db_connection

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

# Root API Route
@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the Medical App Backend!"}

# ✅ Call check_db_connection() when the app starts
@app.on_event("startup")
async def startup_db_check():
    await check_db_connection()
