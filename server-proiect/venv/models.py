from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    password = Column(String)

    email = Column(String, unique=True, index=True) 
    nume = Column(String)
    prenume = Column(String)
    telefon = Column(String, nullable=True) 


    tasks = relationship("TaskDB", back_populates = "owner")

class TaskDB(Base):
    __tablename__ = "tasks" 

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True) 
    status = Column(String, default="in_progress")
    id_owner = Column("UserDB", ForeignKey("users.id"))
    owner = relationship("UserDB", back_populates = "tasks")

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    owner_id: int

class Task(TaskBase):
    id: int
    status: str = "in_progress"

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str 

class UserCreate(UserBase):
    "Inregistrare"
    password: str 

class User(UserBase):
    "Citire date"
    id:int
    tasks: List[Task] = []

    class Config:
        orm_mode = True

class Token(BaseModel):
    "Răspunsul de la login"
    access_token: str
    token_type: str

class TokenData(BaseModel):
    "Token-ului"
    username: Optional[str] = None