from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from ..database import get_db
from .. import models, schemas
from ..auth import get_current_user

router = APIRouter(
    prefix="/api/hospital",
    tags=["Hospital"]
)

@router.post("/doctors", response_model=schemas.Doctor)
def create_doctor(
    doctor: schemas.DoctorCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check if user is admin
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action"
        )

    # Check if doctor with same email already exists
    existing_doctor = db.query(models.Doctor).filter(models.Doctor.email == doctor.email).first()
    if existing_doctor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Doctor with this email already exists"
        )

    # Create new doctor
    db_doctor = models.Doctor(
        name=doctor.name,
        specialization=doctor.specialization,
        experience=doctor.experience,
        rating=doctor.rating,
        patients=doctor.patients,
        email=doctor.email,
        phone=doctor.phone,
        image_url=doctor.image_url,
        expertise=doctor.expertise,
        available_days=doctor.available_days,
        available_time_slots=doctor.available_time_slots,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@router.get("/doctors", response_model=List[schemas.Doctor])
def get_doctors(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    doctors = db.query(models.Doctor).offset(skip).limit(limit).all()
    return doctors

@router.get("/doctors/{doctor_id}", response_model=schemas.Doctor)
def get_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    return doctor

@router.put("/doctors/{doctor_id}", response_model=schemas.Doctor)
def update_doctor(
    doctor_id: int,
    doctor_update: schemas.DoctorUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action"
        )

    db_doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )

    # Update doctor fields
    for field, value in doctor_update.dict(exclude_unset=True).items():
        setattr(db_doctor, field, value)
    
    db_doctor.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@router.delete("/doctors/{doctor_id}")
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to perform this action"
        )

    db_doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )

    db.delete(db_doctor)
    db.commit()
    return {"message": "Doctor deleted successfully"}
