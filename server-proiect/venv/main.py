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


@app.get("/tasks/public", response_model=List[models.Task])
def get_public_tasks(db: Session = Depends(get_db)):
    return [
        models.Task(id=0, title="Bine ați venit! Logați-vă pentru task-uri personale.", description="Task-urile personale sunt protejate.", status="public", owner_id=0)
    ]

@app.post("/register", response_model=models.User)
def register_user(user: models.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        models.User.username == user_data.username
    ).first()
    
    if existing_user:
        raise HTTPException(status_code=400, detail="Username-ul este deja folosit")
    
    existing_email = db.query(models.User).filter(
        models.User.email == user_data.email
    ).first()
    
    if existing_email:
        raise HTTPException(status_code=400, detail="Email-ul este deja folosit")
    
    new_user = models.User(
        username=user_data.username,
        password=hash_password(user_data.password), 
        email=user_data.email,
        nume=user_data.nume,
        prenume=user_data.prenume,
        telefon=user_data.telefon
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "Cont creat cu succes!",
        "user_id": new_user.id,
        "username": new_user.username
    }

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