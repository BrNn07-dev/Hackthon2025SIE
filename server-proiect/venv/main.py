from fastapi import FastAPI, HTTPException, Depends, status
from typing import List
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
import security
import models 
from database import SessionLocal, engine
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/register", response_model=models.User)
def register_user(user: models.UserCreate, db: Session = Depends(get_db)):

    db_user_by_username = security.get_user(db, username=user.username)
    if db_user_by_username:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    db_user_by_email = db.query(models.UserDB).filter(models.UserDB.email == user.email).first()
    if db_user_by_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = security.get_password_hash(user.password)
    new_user = models.UserDB(
        username=user.username,
        hashed_password=hashed_password,
        email=user.email,
        nume=user.nume,
        prenume=user.prenume,
        telefon=user.telefon
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=models.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = security.get_user(db, username=form_data.username)
    
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/tasks", response_model=List[models.Task])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(models.TaskDB).all()
    return tasks

@app.post("/tasks", response_model=models.Task, status_code=201)
def create_task(
    task_to_create: models.TaskBase, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user) 
):
    new_task_db_model = models.TaskDB(
        **task_to_create.dict(),
        owner_id=current_user.id 
    )
    
    db.add(new_task_db_model)
    db.commit()
    db.refresh(new_task_db_model)
    return new_task_db_model

@app.get("/tasks", response_model=List[models.Task])
def get_tasks(
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user) 
):
    
    tasks = db.query(models.TaskDB).filter(models.TaskDB.owner_id == current_user.id).all()
    return tasks


@app.get("/tasks/{task_id}", response_model=models.Task)
def get_single_task(
    task_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):

    task = db.query(models.TaskDB).filter(models.TaskDB.id == task_id).first()
    
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    if task.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this task")
        
    return task


@app.put("/tasks/{task_id}", response_model=models.Task)
def update_task(
    task_id: int, 
    task_update: models.TaskBase, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user)
):
    task = get_single_task(task_id, db, current_user) 

    task.title = task_update.title
    task.description = task_update.description
    
    db.commit()
    db.refresh(task)
    return task


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(
    task_id: int, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(security.get_current_user)
):
    task = get_single_task(task_id, db, current_user) 
    
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted"}